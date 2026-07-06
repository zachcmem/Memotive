
import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(
    request: NextRequest,
    {params}: {params: Promise<{ id: string}>}
){
    try{
        const {id} = await params;
        const body = await request.json();

        const updatedGoal = await prisma.goal.update({
            where: {
                id,
            },
            data: {
                title: body.title,
                description: body.description,
            },
            include: {
                tasks: true
            },
        });

        return NextResponse.json(updatedGoal);
    } 
    catch (error){
        console.error("Failed to update goal: ", error);

        return NextResponse.json(
            {error: "Failed to update goal"},
            {status: 500}
        )
    }
}