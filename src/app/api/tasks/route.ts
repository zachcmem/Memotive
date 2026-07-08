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

        // error handling if no title, not string, or blank
        if (!body.title || typeof body.title !== "string" || body.title.trim() === ""){
            return NextResponse.json(
                {error: "Task title is required"},
                {status: 400}
            )
        }

        // error handing if no goalID or goalID isnt string
        if(!body.goalId || typeof body.goalId !== "string"){
            return NextResponse.json(
                {error: "Goal Id is Required"},
                {status: 400}
            );
        }

        // creeates the data from JSON into a task variable
        const task = await prisma.task.create({
            data:{
                title: body.title.trim(),
                goalId: body.goalId,
            }
        })

        return NextResponse.json(task, {status: 201});   
    }
    catch (error) {
        console.error("Failed to create task:", error);
        return NextResponse.json(
            {error: "Failed to create task"},
            {status: 500}
        )
    }
}

