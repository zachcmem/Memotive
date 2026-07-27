

import ProgressBar from "../ProgressBar";
import ArchivedTaskList from "./ArchivedTaskList";
import type { ArchivedGoal } from "@/types";

type ArchiveGoalCardProps = {
    goal: ArchivedGoal;
    isExpanded: boolean;
    onToggle: () => void;
    onRestore: () => void;
    onDelete: () => void;
    isProcessing?: boolean;
}

export default function ArchiveGoalCard({
    goal,
    isExpanded,
    onToggle,
    onRestore,
    onDelete,
    isProcessing = false
}:ArchiveGoalCardProps){
    const completedTaskCount = goal.tasks.filter(
        (task) => task.completed
    ).length;

    return (
        <article className="rounded-lg border border-neutral-700 bg-neutral-900 p-6 shadow">
        
            {/* Always-visible header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h2 className="break-words text-2xl font-semibold text-white">
                        {goal.title}
                    </h2>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-expanded={isExpanded}
                        aria-controls={`archived-goal-details-${goal.id}`}
                        className="rounded bg-white px-3 py-2 font-medium text-black transition hover:bg-teal-200"
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </button>
                    <button
                        type="button"
                        onClick={onRestore}
                        disabled={isProcessing}
                        className="rounded bg-white px-3 py-2 font-medium text-black transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isProcessing ? "Processing..." : "Restore Goal"}
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isProcessing}
                        aria-label={`Permanently delete ${goal.title}`}
                        title="Permanently delete goal"
                        className="rounded border border-red-400 px-3 py-2 font-medium text-red-300 transition hover:bg-red-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Expandable content */}
            {isExpanded && (
                <div
                id={`archived-goal-details-${goal.id}`}
                className="mt-5"
                >
                    {goal.description && (
                        <p className="mb-4 text-neutral-300">
                            {goal.description}
                        </p>
                    )}

                    <ProgressBar progress={goal.progress} />

                    <p className="mt-3 text-sm text-neutral-400">
                        {completedTaskCount} of {goal.tasks.length} tasks completed
                    </p>

                    <div className="mt-5">
                        <h3 className="mb-2 font-medium text-white">
                            Tasks
                        </h3>
                        <ArchivedTaskList 
                            tasks={goal.tasks} 
                        />
                    </div>
                </div>
            )}

            {/* Always-visible footer */}
            {goal.archivedAt && (
                <p className="mt-5 border-t border-neutral-800 pt-4 text-sm text-neutral-500">
                    Archived on{" "}
                    {new Date(goal.archivedAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            )}
        </article>
  );
}
