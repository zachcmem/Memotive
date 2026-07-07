
//TaskList uses buttons like onClick, should be client
"use client";

//imports of child components
import TaskItem from "./TaskItem";

// type delcarations

type Task = {
    id: string,
    title: string,
    completed: boolean,
}

type TaskListProps = {
    // must pass in the list of tasks per goal
    // doesnt need anything else, other than tasks
    tasks: Task[];
    //function type declarations
    editingTaskId: string | null;
    setEditingTaskId: React.Dispatch<React.SetStateAction<string | null>>;
    handleToggleTask: (taskId: string) => void;
    handleDeleteTask: (taskId: string) => void;
    
}


export default function TaskList({
    //insert the props here
    tasks,
    editingTaskId,
    setEditingTaskId,
    handleToggleTask,
    handleDeleteTask,
}: TaskListProps){
    return(
        <>
            <h3 className="mb-2 text-1xl font-bold">Tasks:</h3>
            <ul>
                {/* only tasked are passed in, instead of goal */}
                {tasks.map((task) => (
                    <TaskItem
                        // must have a key inside a map
                        key={task.id}
                        task={task}
                        isEditing={editingTaskId === task.id}
                        onEdit={()=> setEditingTaskId(task.id)}
                        onCancelEdit={()=>setEditingTaskId(null)}
                        handleToggleTask={handleToggleTask}
                        handleDeleteTask={handleDeleteTask}
                       
                    />
                ))}
            </ul>
        </>
        
    );
}