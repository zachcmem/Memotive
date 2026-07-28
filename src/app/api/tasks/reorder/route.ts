import {prisma} from "@/lib/prisma";

export async function PATCH(request: Request){
    try{
        const body = await request.json();

        // the server uses goalId to verify every submitted task
        // belongs to the same goal
        const {goalId, taskIds} = body;



        // if there is no goalId or goalId isnt string
        if(!goalId || typeof goalId !== "string"){
            return Response.json(
                {error: "A valid goalId is required"},
                {status: 400}
            );
        }

        if (!Array.isArray(taskIds)){
            return Response.json(
                {error: "taskIds must be an array"},
                {status: 400}
            );
        }

        if(!taskIds.every((taskId) => typeof taskId === "string")){
            return Response.json(
                {error: "Every task ID must be a string"},
                {status: 400}
            );
        }

         // edge case
        const goalTaskCount = await prisma.task.count({
            where: {
                goalId,
            },
        });

        if (goalTaskCount !== taskIds.length) {
            return Response.json(
                {
                error: "The reordered list must include every task in the goal",
                },
                { status: 400 }
            );
        }

        const tasks = await prisma.task.findMany({
            where: {
                id:{
                    in: taskIds,
                },
            },
            select:{
                id: true,
                goalId: true,
            },
        });

        if(tasks.length !== taskIds.length){
            return Response.json(
                {error: "One or more tasks were not found"},
                {status: 404}
            );
        }

        const allTasksBelongToGoal = tasks.every(
            (task) => task.goalId === goalId
        );

        if(!allTasksBelongToGoal){
            return Response.json(
                { error: "All tasks must belong to the provided goal" },
                { status: 400 }
            );
        }

       
        
        await prisma.$transaction(
            taskIds.map((taskId, index)=>
                prisma.task.update({
                    where:{
                        id: taskId,
                    },
                    data: {
                        order: index,
                    },
                })
            )
        );

        const reorderedTasks = await prisma.task.findMany({
            where: {
                goalId,
            },
            orderBy: {
                order: "asc",
            },
        });

        return Response.json(reorderedTasks, {
            status: 200
        });
    }
    catch(error){
        console.error("Failed to reorder tasks:", error)

        return Response.json(
            {error: "Failed to reorder tasks"},
            {status: 500}
        );
    }
}