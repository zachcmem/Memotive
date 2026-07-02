
// imports the helper for returning JSON
import { NextResponse } from "next/server"

//imports Prisma client
    //lets the route talk to database
import { prisma } from "@/lib/prisma";

//import reusable logic
import { calculateProgress } from "@/lib/progress";

// defines API behavior for GET
export async function GET(){
    // try / catch can be useful for errors
    try{
        //fetches goals and their tasks
        // include matters because progress depends on tasks
        // if we only fetched goals, route wouldnt not have
        // enough information to calculate progress
        const goals = await prisma.goal.findMany({
            include: {
                tasks: true,
            },
            orderBy:{ 
                createdAt: "desc"
            },
        });

        // this finally adds the progress to last variable
            // keeps original goals but adds the computed field
        const goalsWithProgress = goals.map((goal)=>({
            ...goal,
            progress: calculateProgress(goal.tasks), //calls the goals function
        }))

        // finally, send the result back as a JSON
        return NextResponse.json(goalsWithProgress);
    }
    catch (error){
        console.error("Failed to fetch goals", error);
        return NextResponse.json(
            {error: "Failed to fetch goals"},
            { status: 500 }
        );
    }
}

// The purpose of GET /api/goals is to create a backend doorway that your frontend can use to ask:

// “Give me all the goals from the database.”

// So instead of your dashboard directly depending on mock data, the flow becomes:

// Dashboard page
//    ↓
// GET /api/goals
//    ↓
// Prisma query
//    ↓
// PostgreSQL database
//    ↓
// Return goals as JSON
//    ↓
// Dashboard displays them

// In Next.js App Router, this is done with a Route Handler, 
// which is the modern App Router way to create request 
// handlers inside the app directory. Next.js route handlers 
// support HTTP methods like GET, POST, PUT, PATCH, and DELETE.

// For Memotive, this matters because it separates your app 
// into cleaner responsibilities:

// Database:
// Stores goals and tasks.

// Prisma:
// Talks to the database safely.

// API route:
// Decides what data the app is allowed to request.

// Progress logic:
// Calculates progress in a reusable way.

// Frontend:
// Displays the data.

// That separation is very important because later your web 
// app, mobile app, and maybe desktop app can all reuse the 
// same backend/data shape.

// Since you are using the Next.js app directory
// That folder structure creates this URL automatically:
    
//     /api/goals

// So this file: maps to:

// http://localhost:3000/api/goals

//The key idea is that the API route should not only fetch goals. It can also attach calculated progress using your reusable function.

// That means your route will do three things:

// 1. Fetch goals from Prisma
// 2. Include each goal's tasks
// 3. Add progress to each goal before returning JSON

export async function POST(request: Request){
    try{
        const body = await request.json();

        // error check

        if (!body.title || typeof body.title !== "string" || body.title.trim() === ""){
            return NextResponse.json(
                {error: "Title is required"},
                {status: 400}
            )
        }

        const goal = await prisma.goal.create({
            data:{
                title: body.title,
                description: body.description || null,
            },
            include: {
                tasks: true,
            },
        });
        
        return NextResponse.json(
            {
                ...goal,
                progress: 0,
            },
            {status: 201});
        // status 201 means created succsesfully
        // common repsponse for a post function
    }
    catch(error){
        console.error("Failed to create goal:", error);

        return NextResponse.json(
            {error: "Failed to create goal"},
            {status: 500}
            //status 500 means
        );
    }
}

// What is the Purpose of POST /api/goals? 
// CREATES A NEW GOAL

//FLOW:
// User fills out form
//   ↓
// Frontend sends goal data to /api/goals
//   ↓
// POST function receives the data
//   ↓
// Prisma creates a goal in the database
//   ↓
// API returns the newly created goal
//   ↓
// Dashboard can display it

