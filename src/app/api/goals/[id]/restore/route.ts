
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
    params: Promise<{
        id: string
    }>;
};

export async function PATCH(
    request: Request,
    {params}: RouteParams
){
    try{
        const {id} = await params;

        // finds current last dashboard position
        const lastActiveGoal = await prisma.goal.findFirst({
            where: {
                archived: false,
            },
            orderBy: {
                order: "desc",
            },
            select: {
                order: true,
            }
        });

        // then the restored goal recieves the next order
        const restoredGoal = await prisma.goal.update({
            where: {
                id,
            },
            data: {
                archived: false,
                archivedAt: null,
                order: lastActiveGoal ? lastActiveGoal.order + 1 : 0,
            },
            include: {
                tasks: true,
            },
        });

        return NextResponse.json(restoredGoal)
    }
    catch(error){
        console.error("Failed to restore gaol: ", error)
        return NextResponse.json(
            {error: "Failed to restore goal"},
            {status: 500}
        );
    }
}