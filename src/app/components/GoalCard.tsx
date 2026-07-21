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
import { useState, useRef, useEffect } from "react";
import GoalReorderMenu from "./GoalReorderMenu";

import { useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    handleUpdateTask: (
        taskId: string, 
        updatedTitle: string
    ) => Promise<void>;
    onMoveToTop: (goalId:string) => void;
    onMoveUp: (goalId:string) => void;
    onMoveDown: (goalId:string)=> void;
    onMoveToBottom: (goalId:string)=> void;
    handleArchiveGoal: (goalId:string)=> Promise<void>;
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
    handleUpdateTask,
    onMoveToTop,
    onMoveUp,
    onMoveDown,
    onMoveToBottom,
    handleArchiveGoal,
}: GoalCardProps){

    //useStates for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(goal.title);
    const [editedDescription, setEditedDescription] = useState(goal.description ?? "");
    // null is no task being edited, some task ID means this specific task is edited
    //  one simple boolean wont help because a goal can have many tasks
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    const [isCollapsed, setIsCollapsed] = useState(false);

    // menu state for dragability
    const [isReorderMenuOpen, setIsReorderMenuOpen] = useState(false);
    //use ref states
    const threeDotsMenuRef = useRef<HTMLDivElement>(null);
    const reorderMenuRef = useRef<HTMLDivElement>(null);


    // handles the save editing button
    //     classes the update goal function
    //     sets editing state to false
    function handleSaveEdit(){
        handleUpdateGoal(goal.id, editedTitle, editedDescription);
        setEditingTaskId(null);
        setIsEditing(false);
    }

    useEffect(()=> {
        // When user clicks anywhere on the document,
        // check whether that click happened outside each menu wrapper.
        // If it did, close that menu.
        function handleClickOutside(event: MouseEvent){
            const target = event.target as Node;
            // if (
            //     threeDotsMenuRef.current &&
            //     !threeDotsMenuRef.current.contains(target)
            // ){
            //     setOpenGoalMenuId(null);
            // }
            if(
                reorderMenuRef.current &&
                !reorderMenuRef.current.contains(target)
            ){
                setIsReorderMenuOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };

    }, []);

    //for drag and drop
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: goal.id,
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return(
        <section
            ref={setNodeRef}
            style={style}

            className={`relative rounded-lg border p-6 shadow transition ${
                isDragging
                    ? "opacity-50"
                    : ""
            }${
                isEditing
                ? "bg-neutral-850 border-teal-300 ring-2 ring-teal-200"
                : "bg-neutral-900 border-teal-200"
            }`}
        >
            
            <button
                type="button"
                onClick={()=> setIsCollapsed((current)=> !current)}
                className="text-sm text-teal-300 hover:text-teal-200"
            >
                {isCollapsed ? "Show tasks" : "Hide tasks"}
            </button>


            <div ref={threeDotsMenuRef}>
                <ThreeDotMenu
                    itemId={goal.id}
                    openMenuId={openGoalMenuId}
                    setOpenMenuId={setOpenGoalMenuId}
                    onDelete={handleDeleteGoal}
                    onEdit={() => {
                        setIsEditing(true)
                        setIsCollapsed(false)
                    }}
                    onArchive={handleArchiveGoal}
                />
            </div>

            
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="absolute right-28 top-4 rounded px-2 py-1 bg-white font-medium text-black hover:bg-teal-200 cursor-grab active:cursor-grabbing"
                aria-label="Drag goal"
                >
                    ↕
            </button>
     
            

            <div ref={reorderMenuRef} className="absolute right-16 top-4">
                <GoalReorderMenu
                    goalId={goal.id}
                    isOpen={isReorderMenuOpen}
                    setIsOpen={setIsReorderMenuOpen}
                    onMoveToTop={onMoveToTop}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onMoveToBottom={onMoveToBottom}
                />
            </div>

            
           
            
            
            {/* the state of the goalCard depends on if its editing or not */}
            {isEditing ? (   
                <div className="mb-3 space-y-3">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300"> Editing Goal</p>
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
                </div>
            ) : (
                <>

                    <h2 className="text-2xl font-bold">{goal.title}</h2>

                    <p className="mb-4 font-bold">{goal.description}</p>

                    <ProgressBar
                        progress={goal.progress}
                    />
                </>
                
            )}

            
            {!isCollapsed &&(
                <>
                
                    <TaskList
                        tasks={goal.tasks ?? []} 
                        handleToggleTask={handleToggleTask}
                        handleDeleteTask={handleDeleteTask}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                        handleUpdateTask={handleUpdateTask}
                        isGoalEditing={isEditing} //USE STATE FOR EDITING MODE
                    />

                    <AddTaskForm
                        goalId = {goal.id}
                        taskTitles = {taskTitles}
                        setTaskTitles = {setTaskTitles}
                        handleCreateTask={handleCreateTask}
                    />
                </>
            )}
            
            {isEditing && (
                <div className="mt-4 flex gap-2">
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
            )}
        </section>
    );
}