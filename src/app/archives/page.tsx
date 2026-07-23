"use client";

// Archives page is very simple ATM

// Fetches archived goals to show them as cards
// includes basic loading use state
// includes error use state, 
// includes empty state

import { useEffect, useState } from "react";
import { 
    getArchivedGoals,
    restoreGoal,
    deleteGoal 
} from "@/lib/api";
import ProgressBar from "../components/ProgressBar";
import type { ArchivedGoal, } from "@/types";


export default function ArchivesPage(){

    // use state
    const [archivedGoals, setArchivedGoals] = useState<ArchivedGoal[]>([]);
    // use state for loading
    const [isLoading, setIsLoading] = useState(true);
    // use state for error
    const [error, setError] = useState<string | null>(null);
    // use state for disabling buttons while action runs
    const [processingGoalIdRestore, setProcessingGoalIdRestore] = useState<string | null>(null);

    const [processingGoalIdDelete, setProcessingGoalIdDelete] = useState<string | null>(null);

    const [actionError, setActionError] = useState<string | null>(null);
    
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

    // loading state
    if (isLoading){
        return(
            <main className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-neutral-400">
                        Loading archived goals...
                    </p>
                    <div className="relative flex h-16 w-16 items-center justify-center">
                        <div className="absolute h-16 w-16 animate-ping rounded-full bg-teal-200/10" />
                        <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-teal-200" />
                    </div>
                </div>
            </main>
        )
    }

    //error state
    if(error){
        return(
            <main className="mx-auto min-h-screen max-w-7xl p-8">
                <p className="text-red-300">{error}</p>
            </main>
        )
    }

    //handles restoration
    async function handleRestoreGoal(goalId: string){
        //window module for confirmation
        const confirmed = window.confirm(
            "Restore this goal? It will return to the bottom of your dashboard."
        );

        if(!confirmed){
            return;
        }

        try{
            // action run disabling
            setProcessingGoalIdRestore(goalId);
            
            // first confirms that database updated successfully
            await restoreGoal(goalId);
            // removes it from the archives page immediately
            setArchivedGoals((currentGoals)=>
                currentGoals.filter((goal)=> goal.id !== goalId)
            );
        }
        catch(error){
            console.error("Failed to restore goal: " , error)
            setError("Failed to restore goal.")
        }
    }

    //handles permanent deletion
    async function handleDeleteArchivedGoal(goalId: string){
        const confirmed = window.confirm(
            "Delete this goal? It will be lost forever!"
        );

        if(!confirmed){
            return;
        }

        try{
            //action run disabling
            setProcessingGoalIdDelete(goalId);
            // calls the deleteGoal API helper
            await deleteGoal(goalId);

            // refreshes the goals
            setArchivedGoals((currentGoals)=>
                currentGoals.filter((goal)=> goal.id !== goalId)
            );
        }
        catch(error){
            console.error("Failed to permanently delete goal: ", error);
            // update the set error state
            setError("Failed to permanently delete goal");
        }
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
                <p className="mt-2 text-neutral-400">
                    {archivedGoals.length} archived{" "}
                    {archivedGoals.length === 1 ? "goal" : "goals"}
                </p>
            </div>

            {archivedGoals.length === 0 ? (
                // if theres no archived goals:
                <section className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900 p-8 text-center">
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
                            <div className="mb-3">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-2xl font-semibold text-white">
                                    {goal.title}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRestoreGoal(goal.id)}
                                            disabled={processingGoalIdRestore === goal.id}
                                            className="rounded bg-white px-2 py-2 font-medium text-black transition hover:bg-teal-200"
                                        >
                                            {/* // changes label in action run*/}
                                            {processingGoalIdRestore === goal.id ? "Restoring..." : "Restore Goal"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteArchivedGoal(goal.id)}
                                            disabled={processingGoalIdDelete === goal.id}
                                            className="rounded bg-white px-3 py-2 font-medium text-black transition hover:bg-red-300"
                                        >
                                            {/* // changes label in action run*/}
                                            {processingGoalIdDelete === goal.id ? "Deleting Goal..." : "✖"}
                                        </button>
                                    </div>
                                </div>
                                
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
                                <h3 className="mb-1 font-bold font-medium  text-white">
                                    Tasks
                                </h3>

                                { goal.tasks.length === 0 ? (
                                    // if theres tasks for this goal
                                    <p className="text-sm text-neutral-500">
                                        This goal has no tasks
                                    </p>
                                ) : (
                                    // if there are tasks for this goal, list them
                                    // tasks summary
                                    <>
                                        <p className="mb-2 text-sm text-neutral-400">
                                            {goal.tasks.filter((task)=> task.completed).length} of{" "}
                                            {goal.tasks.length} tasks completed
                                        </p>
                                    
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
                                    </>
                                )}
                            </div>
                            
                            
                            
                                
                            {/* archived goal information */}
                            {goal.archivedAt &&(
                                <p className="mt-5 text-sm text-neutral-500">
                                    Archived on{" "}
                                    {new Date(goal.archivedAt).toLocaleDateString(undefined, {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            )}

                            

                            
                        </article>
                        ))}
                </section>
            )}
        </main> 
    )
}