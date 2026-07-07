// Should handle one goal
// Displays the title, description, Progress,
// Menu and Task list

//Goal card uses handlers, forms, and React state setters, 
// therefore it shouldbe a client component
"use client";

// imports of other components here
import TaskList from "./TaskList";
import ProgressBar from "./ProgressBar";
import ThreeDotMenu from "./ThreeDotMenu";
import AddTaskForm from "./AddTaskForm";
import { useState } from "react";

//type delcaration, including props 
type Task = {
  id: string
  title: string
  completed: boolean
};
type Goal = {
  id: string;
  title: string;
  description?: string | null;
  progress: number;
  tasks: Task[]
};

// Read-only objects used to pass data from a parent 
// component down to a child component
type GoalCardProps = {
    goal: Goal,
    openGoalMenuId: string | null;
    // this is a function type signature prop, with parameter 
    // and the return value type (void if no return)
    setOpenGoalMenuId: (goalId: string | null) => void;
    handleDeleteGoal: (goalId: string) => void;
    handleToggleTask: (taskId: string) => void;
    handleDeleteTask: (taskId: string) => void;
    handleCreateTask: (
        event: React.FormEvent<HTMLFormElement>,
        goalId: string
    )=>void;
    handleUpdateGoal: (
        goalId: string,
        updateTitle: string,
        updateDescription : string
    ) => void;
    taskTitles: Record<string,string>;
    setTaskTitles: React.Dispatch<React.SetStateAction<Record<string,string>>>;
};



export default function GoalCard({ 
    // props destructuring
    goal,
    openGoalMenuId,
    setOpenGoalMenuId,
    handleDeleteGoal,
    handleToggleTask,
    handleDeleteTask,
    handleCreateTask,
    handleUpdateGoal,
    taskTitles,
    setTaskTitles,
}: GoalCardProps){

    //useStates for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(goal.title);
    const [editedDescription, setEditedDescription] = useState(goal.description ?? "");
    // null is no task being edited, some task ID means this specific task is edited
    //  one simple boolean wont help because a goal can have many tasks
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    // handles the save editing button
    //     classes the update goal function
    //     sets editing state to false
    function handleSaveEdit(){
        handleUpdateGoal(goal.id, editedTitle, editedDescription);
        setIsEditing(false);
    }

    return(
        <section className="relative rounded-lg bg-neutral-900 border border-teal-200 p-6 shadow">
            
            <ThreeDotMenu
                itemId={goal.id}
                openMenuId={openGoalMenuId}
                setOpenMenuId={setOpenGoalMenuId}
                onDelete={handleDeleteGoal}
                onEdit={() => setIsEditing(true)}
            />

            {/* the state of the goalCard depends on if its editing or not */}
            {isEditing ? (   
                <div className="space-y-3">
                    <p className="text-sm text-teal-700">Editing mode is on</p>
                    <input
                        value={editedTitle}
                        onChange={(e)=> setEditedTitle(e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-lg font-semibold"
                        placeholder="Goal title"
                    />
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Goal Title"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            className="rounded-md bg-teal-200 px-3 py-1 text-sm font-medium text-teal-900 hover:bg-teal-300"
                        >
                            Save
                        </button>
                        <button
                            onClick={()=> {
                                setEditedTitle(goal.title);
                                setEditedDescription(goal.description ?? "")
                                setIsEditing(false);
                            }}
                            className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-500">Normal mode</p>

                    <h2 className="text-2xl font-bold">{goal.title}</h2>

                    <p className="mb-4 font-bold">{goal.description}</p>

                    <ProgressBar
                        progress={goal.progress}
                    />

                    <TaskList
                        tasks={goal.tasks ?? []} 
                        handleToggleTask={handleToggleTask}
                        handleDeleteTask={handleDeleteTask}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                    />
                    
                    <AddTaskForm
                        goalId = {goal.id}
                        taskTitles = {taskTitles}
                        setTaskTitles = {setTaskTitles}
                        handleCreateTask={handleCreateTask}
                    />
                </>
                
            )}

        </section>
    );
}