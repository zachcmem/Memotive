// The purpose of this route is:

//     When a user clicks a task checkbox/button,
//     update that task from incomplete → complete
//     or complete → incomplete.

// What should PATCH do?

//     The frontend will eventually send:

//         fetch(`/api/tasks/${task.id}`, {
//         method: "PATCH",
//         })

//     Then your backend should:

//     1. Read the task id from the URL.
//     2. Find the current task.
//     3. Flip completed from true to false, or false to true.
//     4. Return the updated task.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
    params: Promise<{
        id: string;
    }>
}

export async function PATCH(request: Request, {params}: RouteParams){
    try{
        const { id } = await params;

        const existingTask = await prisma.task.findUnique({
            where: {
                id,
            }
        });

        if(!existingTask){
            return NextResponse.json(
                {error: "Task not found"},
                {status: 404}
            );
        }

        // the updated task with completed
        const updatedTask = await prisma.task.update({
            where: {
                id,
            },
            data: {
                completed: !existingTask.completed
            }
        });

        return NextResponse.json(updatedTask);

    }
    catch (error){
        console.error("Failed to update task:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500}
        );
    }
}