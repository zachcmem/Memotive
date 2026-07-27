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
import ArchiveToolBar from "../components/archives/ArchiveToolBar";

import type { SortOption } from "@/types";

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

    const [expandedGoalIds, setExpandedGoalIds] = useState<string[]>([]);

    //use state for searching
    const [searchQuery, setSearchQuery] = useState("");

    // use state for sorting -> search options added
    // const [sortOption, setSortOption] = useState<
    //     | "archived-newest"
    //     | "archived-oldest"
    //     | "title-asc"
    //     | "title-desc"
    //     | "progress-high"
    //     | "progress-low"
    // >("archived-newest");

    const [sortOption, setSortOption] = useState<SortOption>(
        "archived-newest"
    );

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

    //helps handle toggling feature
    function handleToggleGoal(goalId: string){
        setExpandedGoalIds((currentIds) => 
            currentIds.includes(goalId) 
                ? currentIds.filter((id) => id !== goalId)
                : [...currentIds, goalId]
        );
    }

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    const visableArchivedGoals = [...archivedGoals]
        .filter((goal)=> {
            if(!normalizedSearchQuery){
                return true;
            }

        const titleMatches = goal.title
            .toLowerCase()
            .includes(normalizedSearchQuery);


        const descriptionMatches = goal.description
            ?.toLowerCase()
            .includes(normalizedSearchQuery);

        const taskMatches = goal.tasks.some((task) => 
            task.title.toLowerCase().includes(normalizedSearchQuery)
        );

        return titleMatches || descriptionMatches || taskMatches;
    })
    .sort((goalA, goalB)=> {
        switch (sortOption) {
            case "archived-oldest":
                return(
                    new Date(goalA.archivedAt ?? 0).getTime() -
                    new Date(goalB.archivedAt ?? 0).getTime()
                );
            
                case "title-asc":
                    return goalA.title.localeCompare(goalB.title);

                case "title-desc":
                    return goalB.title.localeCompare(goalA.title);

                case "progress-high":
                    return goalB.progress - goalA.progress;

                case "progress-low":
                    return goalA.progress - goalB.progress;

                case "archived-newest":
                default:
                    return (
                        new Date(goalB.archivedAt ?? 0).getTime() -
                        new Date(goalA.archivedAt ?? 0).getTime()
                    );
                
        }
    });

    return(
        <main className="mx-auto min-h-screen max-w-7xl p-8">

            
            <div className="rounded-lg border border-teal-200 bg-neutral-900 p-6 shadow">
                <h1 className="text-3xl text-center font-bold text-teal-200">
                    Archived Goals
                </h1>
                <p className="mt-3 text-neutral-300">
                    Review goals that are no longer displayed on your dashboard.
                </p>
                <div className="mt-2  flex items-center gap-3">
                    <span className="flex items-center  rounded-full bg-teal-200 px-2 py-2 text-sm font-bold text-black">
                    </span>
                    <p className=" text-neutral-400">
                        {archivedGoals.length} archived{" "}
                        {archivedGoals.length === 1 ? "goal" : "goals"}
                    </p>
                </div>
            </div>

            {/* searching and sorting*/}
            <ArchiveToolBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOption={sortOption}
                setSortOption={setSortOption}
                visibleCount={visableArchivedGoals.length}
                totalCount={archivedGoals.length}
            />

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
            ): visableArchivedGoals.length === 0 ? (
                <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-8 text-center">
                    <h2 className="text-xl font-semibold text-white">
                        No Matching Goals
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Try changing or clearing your search.
                    </p>
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="mt-4  rounded bg-white px-4 py-2 font-medium text-black transition hover:bg-teal-200"
                    >
                        Clear Search
                    </button>
                </section>
            ):(
                // if there are archived goals:
                    // map them
                <section className="space-y-6">
                    {visableArchivedGoals.map((goal)=> {
                        const isExpanded = expandedGoalIds.includes(goal.id);
                        
                        return(
                            <article
                                key={goal.id}
                                className="rounded-lg mt-4 border border-teal-200 bg-neutral-900 p-6 shadow"
                            >
                                {/* always visable */}
                                <div className=" mb-3 flex items-center justify-between gap-3">
                                    <h2 className="text-2xl font-semibold text-white">
                                    {goal.title}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={()=> handleToggleGoal(goal.id)}
                                            aria-expanded={isExpanded}
                                            className="rounded bg-white px-2 py-0.5 font-medium text-black transition hover:bg-teal-200"
                                        >
                                            {isExpanded ? "-" : "+"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteArchivedGoal(goal.id)}
                                            disabled={processingGoalIdDelete === goal.id}
                                            className="rounded bg-white px-1.5 py-0.5 font-medium text-black transition hover:bg-red-300"
                                        >
                                            {/* // changes label in action run*/}
                                            {processingGoalIdDelete === goal.id ? "Deleting Goal..." : "✖"}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (    
                                    <div className="mt-3">    
                                        {/* if theres a goal description */}
                                        {goal.description && (
                                            <p className="mt-2 text-neutral-300">
                                                {goal.description}
                                            </p>
                                        )}
                                        
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
                                    
                                    </div>
                                )}
                                
                                    
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
                                <button
                                    type="button"
                                    onClick={()=> handleRestoreGoal(goal.id)}
                                    className="text-sm text-teal-300 hover:text-teal-200 hover:underline"
                                    disabled={processingGoalIdRestore === goal.id}
                                >   
                                    {processingGoalIdRestore === goal.id ? "Restoring..." : "Restore Goal"}
                                </button>    
                            </article>
                        )
                    })}
                </section>
            )}
        </main> 
    )
}