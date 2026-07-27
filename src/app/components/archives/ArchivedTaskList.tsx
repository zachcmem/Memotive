import type { ArchivedTask } from "@/types";

type ArchivedTaskListProps = {
    // the list of tasks from the ArchivedTasks array
    tasks: ArchivedTask[];
}

export default function ArchivedTaskList({
    tasks,
}: ArchivedTaskListProps){
    if(tasks.length === 0){
        return(
            <p className="text-sm text-neutral-500">
                This goal has no tasks.
            </p>
        );
    }
    return(
        <ul className="space-y-2">
            {tasks.map((task) => (
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

    );
}
