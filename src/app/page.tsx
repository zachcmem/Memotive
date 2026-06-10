// MAIN PAGE

//DEEP DIVE

//STATIC MOCK UI
// NO DATABASE CONNECTED
// AI GENERATED
const goals = [
  {
    title: "Launch Memotive MVP",
    description: "Build the first usable goal and task dashboard.",
    progress: 40,
    tasks: [
      { title: "Create GitHub repo", completed: true },
      { title: "Set up Prisma", completed: true },
      { title: "Build dashboard UI", completed: false },
    ],
  },
  {
    title: "Improve developer workflow",
    description: "Practice Git, VS Code, and backend basics.",
    progress: 25,
    tasks: [
      { title: "Push first commit", completed: true },
      { title: "Create database models", completed: false },
    ],
  },
];

//HOME PAGE
export default function Home() {
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
          {goals.map((goal) => (
            <div
              key={goal.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold">{goal.title}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {goal.description}
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>

                <div className="mt-2 h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-white"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {goal.tasks.map((task) => (
                  <li
                    key={task.title}
                    className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-sm"
                  >
                    <span>{task.title}</span>
                    <span>{task.completed ? "Done" : "Open"}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};