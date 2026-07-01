
//TaskList uses buttons like onClick, should be client
"use client";

// type delcarations

type Task = {
    id: string,
    title: string,
    completed: boolean,
}

type TaskListProps = {
    // must pass in the list of tasks per goal
    // doesnt need anything else, other than tasks
    tasks: Task[],
    //function type declarations
    handleToggleTask: (taskId: string) => void;
    handleDeleteTask: (taskId: string) => void;
}


export default function TaskList({
    //insert the props here
    tasks,
    handleToggleTask,
    handleDeleteTask,
}: TaskListProps){
    return(
        <>
            <h3 className="mb-2 text-1xl font-bold">Tasks:</h3>
            <ul>
                {/* only tasked are passed in, instead of goal */}
                {tasks.map((task) => (
                    <li key={task.id}>
                        <button 
                            className="mb-2 rounded bg-white px-4 py-2 font-medium text-black hover:bg-teal-200" 
                            onClick={()=> handleToggleTask(task.id)}>
                            {task.completed ? "☑︎" : "☐"}
                        </button>
                        &nbsp;&nbsp;{task.title}&nbsp;&nbsp;
                        <button
                            type="button"
                            onClick={()=> handleDeleteTask(task.id)}
                            className="mb-2 rounded bg-white px-1 py-1 font-medium text-black hover:bg-teal-200" >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </>
        
    );
}