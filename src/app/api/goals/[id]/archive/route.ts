import {NextResponse} from "next/server";
import{prisma} from "@/lib/prisma";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    {params}: RouteParams
){
    try{
        console.log("Archive route reached");
        const {id} = await params;

        const archivedGoal = await prisma.goal.update({
            where: {
                id,
            },
            data: { // updates the attributes, changes view from dashboard
                archived: true,
                archivedAt: new Date(),
            },
            include: {
                tasks: true
            },
        });

        return NextResponse.json(archivedGoal);
    }
    catch(error){
        console.error("Failed to archive goal: ", error)

        return NextResponse.json(
            {error: "Failed to archive goal"},
            {status: 500}
        )
    }
}