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
    taskTitles: Record<string,string>;
    setTaskTitles: React.Dispatch<React.SetStateAction<Record<string,string>>>;
};



export default function GoalCard({ 
    goal,
    openGoalMenuId,
    setOpenGoalMenuId,
    handleDeleteGoal,
    handleToggleTask,
    handleDeleteTask,
    handleCreateTask,
    taskTitles,
    setTaskTitles,
}: GoalCardProps){
    const [isEditing, setIsEditing] = useState(false);
    const [editiedTitle, setEditedTitle] = useState(goal.title);
    const [editedDescription, setEditedDescription] = useState(goal.description ?? "");
    return(
        <section className="relative rounded-lg bg-neutral-900 border border-teal-200 p-6 shadow">
            
            <ThreeDotMenu
                itemId={goal.id}
                openMenuId={openGoalMenuId}
                setOpenMenuId={setOpenGoalMenuId}
                onDelete={handleDeleteGoal}
                onEdit={() => setIsEditing(true)}
            />
            {isEditing ? (
                <p className="text-sm text-teal-700">Editing mode is on</p>
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