// Should handle one goal
// Displays the title, description, Progress,
// Menu and Task list

//Goal card uses handlers, forms, and React state setters, 
// therefore it shouldbe a client component
"use client";

// imports of other components here
import TaskList from "./TaskList";
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
    return(
        <section className="relative rounded-lg bg-neutral-900 border border-teal-200 p-6 shadow">
            
            {/* MENU OPTION BUTTON */}
            <button
            type="button"
            onClick={()=> setOpenGoalMenuId(openGoalMenuId === goal.id ? null : goal.id)}
            className="absolute right-4 top-4 rounded px-2 py-1 bg-teal-200 font-medium text-black hover:bg-teal-200"
            >
                ...
            </button>
            
            {openGoalMenuId === goal.id && (
            <div className="absolute right-4 top-12 z-10 w-32 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-lg">
                <button
                type="button"
                className="block w-full rounded px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700"
                >
                    Edit
                </button>

                <button
                type="button"
                onClick={() => handleDeleteGoal(goal.id)}
                className="block w-full rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-700"
                >
                    Delete
                </button>
            </div>
            )}

            <h2 className="text-2xl font-bold">{goal.title}</h2>

            <p className="mb-4 font-bold">{goal.description}</p>

            <p className="mb-2 text-sm text-teal-200">
                Progress: {goal.progress}%
            </p>

            <div className="mb-2 h-3 w-full rounded-full bg-gray-200">
                <div
                    className=" h-3 rounded-full bg-teal-200"
                    style={{ width: `${goal.progress}%` }}
                />
            </div>

            <TaskList
                tasks={goal.tasks}
                handleToggleTask={handleToggleTask}
                handleDeleteTask={handleDeleteTask}
            />
            

            <form onSubmit={(event)=> handleCreateTask(event, goal.id)}>
                <input
                    className="rounded border border-black bg-teal-200 px-3 py-2 text-black placeholder:text-black"
                    value= {taskTitles[goal.id] || ""}
                    onChange={(event)=> 
                    setTaskTitles((currentTaskTitles) => ({
                        ...currentTaskTitles,
                        [goal.id]: event.target.value,
                    }))
                    }
                    placeholder="New Task"
                />
            </form>
        </section>
    );
}