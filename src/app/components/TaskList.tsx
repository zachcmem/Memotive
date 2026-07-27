
//TaskList uses buttons like onClick, should be client
"use client";

//imports of child components
import TaskItem from "./TaskItem";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableTaskItem from "./SortableTaskItem";

// type delcarations

type Task = {
    id: string,
    title: string,
    completed: boolean,
    goalId: string,
    order: number,
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
    handleUpdateTask: (
        taskId: string, 
        updatedTitle: string
    ) => Promise<void>;
    isGoalEditing: boolean;
    goalId: string;
    onReorderTasks: (
        goalId: string,
        activeTaskId: string,
        overTaskId: string
    ) => void;
    
}


export default function TaskList({
    //insert the props here
    tasks,
    editingTaskId,
    setEditingTaskId,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTask,
    isGoalEditing,
    goalId,
    onReorderTasks,
}: TaskListProps){
    console.log("TaskList isGoalEditing:", isGoalEditing);
    
    // no tasks in goal state
    if(tasks.length === 0){
        return(
            <p className="my-3 rounded-md border border-dashed border-teal-200 px-3 py-2 text-sm text-slate-400">
                No tasks yet- add your first task to start making progress
            </p>
        );
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    //drag-end handler
    function handleTaskDragEnd(event: DragEndEvent){
        const {active, over} = event;
        if(!over){
            return;
        }
        if(active.id === over.id){
            return;
        }
        onReorderTasks(
            goalId,
            String(active.id),
            String(over.id)
        );
    }
    
    return(
        <>
            <h3 className="mb-2 text-1xl font-bold">Tasks:</h3>
            <ul>
                {/* only tasked are passed in, instead of goal
                {tasks.map((task) => (
                    <TaskItem
                        // must have a key inside a map
                        key={task.id}
                        task={task}
                        isTaskEditing={editingTaskId === task.id}
                        isGoalEditing={isGoalEditing}
                        onEdit={()=> setEditingTaskId(task.id)}
                        onCancelEdit={()=>setEditingTaskId(null)}
                        handleToggleTask={handleToggleTask}
                        handleDeleteTask={handleDeleteTask}
                        handleUpdateTask={handleUpdateTask}
                       
                    />
                ))} */}
                <DndContext
                    sensors={sensors}
                    onDragEnd={handleTaskDragEnd}
                >
                    <SortableContext
                        // gives dnd-kit the task order crrentlt shown on screen
                        items={tasks.map((task)=>task.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {tasks.map((task)=> (
                                <SortableTaskItem
                                    key={task.id}
                                    taskId={task.id}
                                    disabled={isGoalEditing}
                                >
                                    <TaskItem
                                        task={task}
                                        isEditing={editingTaskId === task.id}
                                        onEdit={()=> onEditTask(task.id)}
                                        onCancelEdit={onCancelEditTask}
                                        handleToggleTask={handleToggleTask}
                                        handleDeleteTask={handleDeleteTask}
                                        handleUpdateTask={handleUpdateTask}
                                    />
                                </SortableTaskItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </ul>
        </>
        
    );
}