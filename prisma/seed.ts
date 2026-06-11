// import PrismaClient, used for Node.js and TypeScript
//      define Datamodels in schema 
//      scehma generator client {} command constructs prisma client
//      import clients into projects to easily run queries (const users = await etc)

// DISSECT PAST LINE 51

import { PrismaClient } from "@prisma/client/extension";

// creates prisma object instance
const prisma = new PrismaClient();

// aynchronous code through promises
async function main(){
    // delete all documents in the collections
    await prisma.task.deleteMany();
    await prisma.goal.deleteMany();

    //add the goal data point
    await prisma.goal.create({
        data:{
            title: "Launch Memotive MVP",
            description: "Build the first usable version of the Memotive dashboard.",
            tasks: {
                create: [
                { title: "Create GitHub repo", completed: true },
                { title: "Set up Prisma", completed: true },
                { title: "Build mock dashboard UI", completed: true },
                { title: "Connect dashboard to real data", completed: false },
                ],
            },
        },
    });
    
    //add another goal data point
    await prisma.goal.create({
        data:{
            title: "Improve developer workflow",
            description: "Practice Git, VS Code, Prisma, and full-stack development.",
            tasks: {
                create: [
                { title: "Run migrations", completed: true },
                { title: "Open Prisma Studio", completed: true },
                { title: "Create first API route", completed: false },
                ],
            },
        }
    });
}

main()
    //passes asynchronous function callback into existing promise chain
    // used when a previous asynchronous operation completes 
    // and you want to trigger a new block of code that requires
    // the await keyword
    .then(async ()=> {
        //disconnect terminates active connection to stop continuous process
        // applies to database sections or APIs
        await prisma.$disconnect();
    })
    // handles errors
    .catch (async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    })

