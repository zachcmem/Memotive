
import {NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";

//route expects frontend to send data shaped like:
// {
//   "goalIds": ["goal-id-1", "goal-id-2", "goal-id-3"]
// }

// Route then turns that into
// goal-id-1 -> order: 0
// goal-id-2 -> order: 1
// goal-id-3 -> order: 2

export async function PATCH(request: Request){
    try {
        const body = await request.json();

        const {goalIds} = body;

        if(!Array.isArray(goalIds)){
            return NextResponse.json(
                {error: "goalIds must be an array"},
                {status: 400}
            );
        }

        // safety check for goalIds
        if(!goalIds.every((goalId)=> typeof goalId === "string")){
            return NextResponse.json(
                { error: "Every goalId must be a string"},
                { status: 400}
            )
            
        }

        // important part, $transaction makes sure the reorder
        // happens as one grouped database operation
        // that is better than upodating one goal at a time 
        // seperately
        await prisma.$transaction(
            goalIds.map((goalId, index)=> 
            prisma.goal.update({
                where: {
                    id: goalId,
                },
                data: {
                    order: index
                }
            }))
        );

       
        return NextResponse.json({
            message: "Goal reordered successfully",

        });
    }
    catch(error){
        console.error("Failed to reorder goals: ", error);

        return NextResponse.json(
            {error: "Failed to reorder goals"},
            { status: 500}
        );
    }
}

