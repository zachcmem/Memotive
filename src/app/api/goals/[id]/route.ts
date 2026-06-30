
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(request: Request, {params}: RouteParams){

    try{

        const { id } = await params;

        await prisma.goal.delete({
            where: {
                id,
            }
        });

        return NextResponse.json(
            { message: "Goal deleted successfully"},
            { status: 200}
        );
    }
    catch(error){
        console.error("Failed to delete goal: ", error)
        return NextResponse.json(
            {error: "Failed to delete goal"},
            {status: 500}
        )
    }

}