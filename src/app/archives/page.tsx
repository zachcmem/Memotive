"use client";

// Archives page is very simple ATM

// Fetches archived goals to show them as cards
// includes basic loading use state
// includes error use state, 
// includes empty state

import { useEffect, useState } from "react";
import { getArchivedGoals } from "@/lib/api";
import ProgressBar from "../components/ProgressBar";
import type { ArchivedGoal } from "@/types";

// type Task = {
//     id: string;
//     title: string;
//     completed: boolean;
//     goalId: string;
// }

// type ArchivedGoal = {
//     id: string;
//     title: string;
//     description: string | null;
//     createdAt: string;
//     archivedAt: string | null;
//     progress: number;
//     tasks: Task[];
// }

export default function ArchivesPage(){

    // use state
    const [archivedGoals, setArchivedGoals] = useState<ArchivedGoal[]>([]);
    // use state for loading
    const [isLoading, setIsLoading] = useState(true);
    // use state for error
    const [error, setError] = useState<string | null>(null);

    // useEffect
    useEffect(()=> {
        async function loadArchivedGoals(){
            try{
                const goals = await getArchivedGoals();
                setArchivedGoals(goals);
            }
            catch(error){
                console.error("Failed to load archived goals.");
                setError("failed to load archived goals.")
            }
            finally{
                setIsLoading(false);
            }
        }
        loadArchivedGoals();
    },[]);

    if (isLoading){
        return(
            <main className="mx-auto min-h-screen max-w-7xl p-8">
                <p className="text-neutral-300">Loading archived goals...</p>
             </main>
        )
    }

    if(error){
        return(
            <main className="mx-auto min-h-screen max-w-7xl p-8">
                <p className="text-red-300">{error}</p>
            </main>
        )
    }

    return(
        <main className="mx-auto min-h-screen max-w-7xl p-8">
            <div className="rounded-lg border border-teal-200 bg-neutral-900 p-6 shadow">
                <h1 className="text-3xl text-center font-bold text-teal-200">
                    Archived Goals
                </h1>
                <p className="mt-3 text-neutral-300">
                    Review goals that are no longer displayed on your dashboard.
                </p>
            </div>

            {archivedGoals.length === 0 ? (
                // if theres no archived goals:
                <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-8 text-center">
                    <h2 className="text=xl font-semibold text-white">
                        No Archived Goals Yet
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Goals you archive from the dashboard will appear here
                    </p>
                </section>
            ):(
                // if there are archived goals:
                    // map them
                <section className="space-y-6">
                    {archivedGoals.map((goal)=> (
                        <article
                            key={goal.id}
                            className="rounded-lg mt-4 border bg-neutral-900 p-6 shadow"
                        >
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold text-white">
                                    {goal.title}
                                </h2>
                                {/* if theres a goal description */}
                                {goal.description && (
                                    <p className="mt-2 text-neutral-300">
                                        {goal.description}
                                    </p>
                                )}
                            </div>
                            {/* progress bar component*/}
                            <ProgressBar progress={goal.progress}/>

                            <div className="mt-5">
                                <h3 className="mb-2 font-bold font-medium  text-white">
                                    Tasks
                                </h3>

                                { goal.tasks.length === 0 ? (
                                    // if theres tasks for this goal
                                    <p className="text-sm text-neutral-500">
                                        This goal has no tasks
                                    </p>
                                ) : (
                                    // if there are tasks for this goal, list them
                                    <ul className="space-y-2">
                                        {goal.tasks.map((task)=>(
                                            <li
                                                key={task.id}
                                                className="flex items-center gap-3 rounded bg-neutral-800 px-4 py-3"
                                            >
                                            <span
                                                className={`h-3 w-3 rounded-full ${
                                                    task.completed
                                                        ? "bg-teal-200"
                                                        : "bg-neutral-500"
                                                }`}
                                            />
                                            <span
                                                className={
                                                    task.completed
                                                        ? "text-neutral-400 line-through"
                                                        : "text-neutral-200"
                                                }
                                            >
                                                {task.title}
                                            </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            
                            {/* archived goal information */}
                            {goal.archivedAt && (
                                <p className="mt-5 text-sm text-neutral-500">
                                    Archived{" "}
                                    {new Date(goal.archivedAt).toLocaleDateString()}
                                </p>
                            )}
                        </article>
                        ))}
                </section>
            )}
        </main> 
    )
}