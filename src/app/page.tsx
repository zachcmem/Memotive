// MAIN PAGE -> DEEP DIVE

// bracket imports are named imports from files with multiple exports
import { prisma } from "@/lib/prisma"
import { calculateProgress } from "@/lib/progress";

// REMOVED STATIC DATABASE MODULE

// turned into async function for await promise
export default async function Home() {
  // initiate the goals await function 
  // findMany() retrives multipe records from database table / collection
  // calling without arguements returns all records for that specific model
  const goals = await prisma.goal.findMany({
    include:{
      tasks: true
    },
    orderBy:{
      createdAt: "desc",
    }
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Memotive
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Your goal progress dashboard
        </h1>

        <p className="mt-3 text-slate-300">
          Turn big goals into smaller tasks and track your momentum over time.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* map function to list data 
          creates new array populated with results of calling 
          function for every single element of the array*/}
          {/* DEEP DIVE INTO MAPPING LOGIC */}
          {goals.map((goal) => {
            const progress = calculateProgress(goal.tasks);
            
            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
              >
                <h2 className="text-xl font-semibold">{goal.title}</h2>

                {goal.description && (
                  <p className="mt-2 text-sm text-slate-400">
                    {goal.description}
                  </p>
                )}

                <div className="mt-5">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="mt-2 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-white"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <ul className="mt-5 space-y-2">
                  {goal.tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-sm"
                    >
                      <span>{task.title}</span>
                      <span>{task.completed ? "Done" : "Open"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

// Works because in the App Router, pages are Server 
// Components by default, so page can directly fetch 
// server side data.For API-style endpoints later, Next.js 
// uses Route Handlers inside the app directory, supporting
// methods like GET POST PUT PATCH DELETE
