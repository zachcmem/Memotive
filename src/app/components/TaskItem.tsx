"use client";

import { useState } from "react";

type Task = {
    id: string,
    title: string,
    completed: boolean,
}

type TaskItemProps = {
    // must pass in the list of tasks per goal
    // doesnt need anything else, other than tasks

    //TaskItem only needs the task object. 
    // JUST ONE not the whole list
    task: Task;
    //function type declarations
    handleToggleTask: (taskId: string) => void;
    handleDeleteTask: (taskId: string) => void;
    isTaskEditing: boolean;
    isGoalEditing: boolean;
    onEdit: () => void;
    onCancelEdit: () => void;
    handleUpdateTask: (
        taskId: string, 
        updatedTitle: string
    ) => Promise<void>;
}

export default function TaskItem({
    //prop destructuring
    task,
    isTaskEditing,
    onEdit,
    onCancelEdit,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTask,
    isGoalEditing,
}: TaskItemProps){

    // temporary input state inside TaskItem
    const [editedTaskTitle, setEditedTaskTitle] = useState(task.title);
    console.log("TaskItem isGoalEditing:", isGoalEditing);
    return (
        <div className="flex items-center justify-between rounded bg-neutral-800 py-3 pl-3 pr-12">
            <div className="flex items-center">
            {/* Checklist button stays visible at all times */}
            <button
                className={`rounded px-4 py-2 font-medium text-black transition ${
                task.completed
                    ? "bg-teal-200"
                    : "bg-white hover:bg-teal-200"
                }`}
                onClick={() => handleToggleTask(task.id)}
            >
                {task.completed ? "☑︎" : "☐"}
            </button>

            {isTaskEditing ? (
                <div className="ml-3 flex items-center gap-2">
                <input
                    value={editedTaskTitle}
                    onChange={(e) => setEditedTaskTitle(e.target.value)}
                    className="rounded border border-teal-200 px-3 py-2 text-sm"
                    placeholder="Task title"
                />

                <button
                    type="button"
                    onClick={async () => {
                    await handleUpdateTask(task.id, editedTaskTitle);
                    onCancelEdit();
                    }}
                    className="rounded bg-teal-200 px-2 py-1 text-sm font-medium text-black hover:bg-teal-300"
                >
                    Save
                </button>

                <button
                    type="button"
                    onClick={() => {
                    setEditedTaskTitle(task.title);
                    onCancelEdit();
                    }}
                    className="rounded bg-white px-2 py-1 text-sm font-medium text-black hover:bg-teal-300"
                >
                    Cancel
                </button>
                </div>
            ) : (
                <>
                <span
                    onDoubleClick={onEdit}
                    className="ml-3 cursor-text"
                    title="Double-click to rename task"
                >
                    {task.title}
                </span>

                {isGoalEditing && (
                    <div className="ml-3 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="rounded bg-white px-1 py-1 font-medium text-black hover:bg-teal-200"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                        const confirmed = window.confirm(
                            "Are you sure you want to delete this task?"
                        );

                        if (!confirmed) return;

                        handleDeleteTask(task.id);
                        }}
                        className="rounded bg-white px-1 py-1 font-medium text-black hover:bg-teal-200"
                    >
                        Delete
                    </button>
                    </div>
                )}
                </>
            )}
            </div>
        </div>
    );
    
}