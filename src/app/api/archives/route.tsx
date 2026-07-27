
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProgress } from "@/lib/progress";

// retrieves full archive collection
export async function GET(){
    try{
        const archivedGoals = await prisma.goal.findMany({
            where:{
                archived: true
            },
            include:{
                tasks: {
                    orderBy: {
                        order: "asc",
                    }
                }
            },         
            orderBy: {
                archivedAt: "desc"
            }
        });

        const archivedGoalsWithProgress = archivedGoals.map((goal)=> ({
            ...goal,
            progress: calculateProgress(goal.tasks)
        }));
        return NextResponse.json(archivedGoalsWithProgress);
    }
    catch(error){
        console.error("Failed to fetch archived goals, ", error)

        return NextResponse.json(
            { error: "Failed to fetch archived goals"},
            {status: 500}
        );
    }
}