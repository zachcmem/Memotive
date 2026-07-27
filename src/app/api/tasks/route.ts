// API endpoints for Tasks

// 6-26 Create POST /api/tasks
// route will “Create a new task and attach it to a specific goal.”

// frontend will send something like
// {
//   "title": "Build task creation route",
//   "goalId": "some-goal-id"
// }

// prisma creates
// {
//   title: body.t itle,
//   goalId: body.goalId
// }

// goalId matters because a task cannot just exist randomly 
// in Memotive. It belongs under a goal

// step 1: calculate the imports
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request){
    try{
        // asynconously parse incoming HTTP requests body as JSON
        const body = await request.json();
        const {title, goalId} = body;

        // error handling if no title, not string, or blank
        if (!title || typeof title !== "string" || title.trim() === ""){
            return NextResponse.json(
                {error: "Task title is required"},
                {status: 400}
            )
        }

        // error handing if no goalID or goalID isnt string
        if(!goalId || typeof goalId !== "string"){
            return NextResponse.json(
                {error: "Goal Id is Required"},
                {status: 400}
            );
        }

        const lastTask = await prisma.task.findFirst({
            where: {
                goalId,
            },
            orderBy: {
                order: "desc",
            },
        });

        const nextOrder = lastTask ? lastTask.order + 1 : 0;

        // creeates the data from JSON into a task variable
        const newTask = await prisma.task.create({
            data:{
                title: body.title.trim(),
                goalId: body.goalId,
                order: nextOrder,
            }
        })

        return NextResponse.json(newTask, {status: 201});   
    }
    catch (error) {
        console.error("Failed to create task:", error);
        return NextResponse.json(
            {error: "Failed to create task"},
            {status: 500}
        )
    }
}

