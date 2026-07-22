"use client";

// Archives page is very simple ATM

// Fetches archived goals to show them as cards
// includes basic loading use state
// includes error use state, 
// includes empty state

import { useEffect, useState } from "react";
import { getArchivedGoals } from "@/lib/api";
import ProgressBar from "../components/ProgressBar";

type Task = {
    id: string;
    title: string;
    completed: boolean;
    goalId: string;
}

type ArchivedGoal = {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    archivedAt: string | null;
    progress: number;
    tasks: Task[];
}

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
            <section className="rounded-lg border border-teal-200 bg-neutral-900 p-6 shadow">
                <h1 className="text-3xl font-bold text-teal-200">
                    Archives
                </h1>
                <p className="mt-3 text-neutral-300">
                    View goals that you have completed or removerd from your active dashboard
                </p>
                <p className="mt-6 text-neutral-300">
                    Archived goals will appear here in a future update
                </p>
            </section>
        </main> 
    )
}