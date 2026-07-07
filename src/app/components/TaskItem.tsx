"use client";

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
    isEditing: boolean;
    onEdit: () => void;
}

export default function TaskItem({
    task,
    isEditing,
    onEdit,
    handleToggleTask,
    handleDeleteTask,
}: TaskItemProps){
    return(
        <li>
            {isEditing ? (
                <p className="text-sm text-teal-700">Editing this task</p>
            ):(
                <>
                <button 
                    className={`mb-2 rounded px-4 py-2 font-medium text-black hover:bg-teal-200 transition ${
                        task.completed
                            ? "bg-teal-200"
                            : "bg-white hover:bg-teal-200"
                    }`}
                    onClick={()=> handleToggleTask(task.id)}
                >
                    {task.completed ? "☑︎" : "☐"}
                </button>
                &nbsp;&nbsp;{task.title}&nbsp;&nbsp;
                <button
                    type="button"
                    onClick={()=> handleDeleteTask(task.id)}
                    className="mb-2 rounded bg-white px-1 py-1 font-medium text-black hover:bg-teal-200" >
                    Delete
                </button>
                <button
                    type="button"
                    onClick={onEdit}
                    className="mb-2 rounded bg-white px-1 py-1 font-medium text-black hover:bg-teal-200"
                >
                    Edit
                </button>
            </>
            )}
        </li>
    );
}