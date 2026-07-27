import ProgressBar from "../ProgressBar";
import ArchivedTaskList from "./ArchivedTaskList";
import type { ArchivedGoal } from "@/types";

type ArchivedGoalCardProps = {
  goal: ArchivedGoal;
  isExpanded: boolean;
  onToggle: () => void;
  onRestore: () => void;
  onDelete: () => void;
  isRestoring: boolean;
  isDeleting: boolean;
};

export default function ArchivedGoalCard({
  goal,
  isExpanded,
  onToggle,
  onRestore,
  onDelete,
  isRestoring,
  isDeleting,
}: ArchivedGoalCardProps) {
  const completedTaskCount = goal.tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <article className="w-full rounded-lg border border-teal-200 bg-neutral-900 p-6 shadow">
      {/* Always-visible header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="min-w-0 break-words text-2xl font-semibold text-white">
          {goal.title}
        </h2>

        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={`archived-goal-details-${goal.id}`}
            aria-label={
              isExpanded
                ? `Collapse ${goal.title}`
                : `Expand ${goal.title}`
            }
            className="rounded bg-white px-2 py-0.5 font-medium text-black transition hover:bg-teal-200"
          >
            {isExpanded ? "−" : "+"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting || isRestoring}
            aria-label={`Permanently delete ${goal.title}`}
            title="Permanently delete goal"
            className="rounded bg-white px-1.5 py-0.5 font-medium text-black transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting Goal..." : "✖"}
          </button>
        </div>
      </div>

      {/* Collapsible details */}
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

            <ArchivedTaskList tasks={goal.tasks} />
          </div>
        </div>
      )}

      {/* Always-visible footer */}
      <div className="mt-5">
        {goal.archivedAt && (
          <p className="text-sm text-neutral-500">
            Archived on{" "}
            {new Date(goal.archivedAt).toLocaleDateString(
              undefined,
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>
        )}

        <button
          type="button"
          onClick={onRestore}
          disabled={isRestoring || isDeleting}
          className="mt-1 text-sm text-teal-300 transition hover:text-teal-200 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRestoring ? "Restoring..." : "Restore Goal"}
        </button>
      </div>
    </article>
  );
}