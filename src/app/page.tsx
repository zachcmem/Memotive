
"use client"; //  is a React directive that marks the boundary between server-rendered and client-rendered code. It tells the bundler to ship a component's JavaScript to the browser, making it interactive
import {useEffect, useState } from "react"
import GoalCard from "./components/GoalCard";
import AddGoalForm from "./components/AddGoalForm";


import{
  createGoal,
  deleteGoal,
  createTask,
  toggleTask,
  deleteTask,
  updateGoal,
  updateTask,
  archiveGoal,
  reorderTasks
} from "@/lib/api";

import { calculateProgress } from "@/lib/progress";

//imports the drag-and-drop features
import {
  DndContext,
  closestCenter,
  DragEndEvent
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import type { Goal } from "@/types";
import type { Task } from "@/types";


// turned into async function for await promise
export default function Home() {

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetches the goals
  async function fetchGoals(){
    try{
      const response = await fetch("/api/goals");
      if(!response.ok){
        throw new Error("Failed to fetch goals");
      }
      const data = await response.json();
      setGoals(data);
    }
    catch (err){
      setError("Could not load goals.");
    }
    finally{
      setLoading(false);
    }
  }


  useEffect(()=> {
    fetchGoals();
  }, []);
  
  //dashboard for adding goal
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreateGoal(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    console.log("Creating goal:", title, description); // console log
    try{
      // calls the function in lib/api.ts
      const newGoal = await createGoal(title, description);

      const goalWithDefaults = {
        ...newGoal,
        progress: newGoal.progress ?? 0,
        // this line makes sure if newGoal.tasks exist, use it
        //    but if it doesnt exist, use an empty array so it can map still
        tasks: newGoal.tasks ?? [],
      };

      setGoals((currentGoals) => [...currentGoals, goalWithDefaults]);

      setTitle("");
      setDescription("");
    } 
    catch (error){
      console.error("Failed to create goal: ", error)
    }
  }

  // ADDING TASKS TO EACH GOAL

  const [taskTitles, setTaskTitles] = useState<Record<string,string>>({});
  async function handleCreateTask(
    event: React.FormEvent<HTMLFormElement>,
    goalId: string //every task must be attributed to a goalId
    ){
    event.preventDefault();
    // grabs the task title for the specific gaol
    const taskTitle = taskTitles[goalId];
    if (!taskTitle){
      return;
    }
    try{
      const newTask = await createTask(goalId, taskTitle);

      setGoals((currentGoals)=>
        currentGoals.map((goal)=>{
          if (goal.id !== goalId){
            return goal;
          }
          const updatedTasks = [...(goal.tasks ?? []), newTask];
          return {
            ...goal,
            tasks: updatedTasks,
            progress: calculateProgress(updatedTasks),
          };
        })
      );

      setTaskTitles((currentTaskTitles)=>({
        ...currentTaskTitles,
        [goalId]: "",
      }));
    }
    catch(error){
      console.error("Failed to create task: ", error)
    }
  }

  async function handleToggleTask(taskId: string) {
    try {
      const currentGoal = goals.find((goal) =>
        goal.tasks.some((task) => task.id === taskId)
      );

      if (!currentGoal) return;

      const currentTask = currentGoal.tasks.find((task) => task.id === taskId);

      if (!currentTask) return;

      const updatedTask = await toggleTask(taskId, !currentTask.completed);

      setGoals((currentGoals) =>
        currentGoals.map((goal) => {
          if (goal.id !== currentGoal.id) {
            return goal;
          }

          const updatedTasks = goal.tasks.map((task) =>
            task.id === taskId ? updatedTask : task
          );

          return {
            ...goal,
            tasks: updatedTasks,
            progress: calculateProgress(updatedTasks),
          };
        })
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  }

  async function handleDeleteTask(taskId: string){
    try{
      await deleteTask(taskId);
      setGoals((currentGoals) =>
        currentGoals.map((goal)=> {
          const goalHasTask = (goal.tasks ?? []).some(
            (task) => task.id === taskId
          );

          if(!goalHasTask){
           return goal; 
          }

          const updatedTasks = (goal.tasks ?? []).filter(
            (task) => task.id !== taskId
          );

          return {
            ...goal,
            tasks: updatedTasks,
            progress: calculateProgress(updatedTasks)
          };
        })
      );
    }
    catch(error){
      console.error("Failed to delete task: ", error);
    }
  }

  async function handleDeleteGoal(goalId: string){
    try{
      await deleteGoal(goalId);

      setGoals((currentGoals)=>currentGoals.filter((goal)=> goal.id !== goalId));
    }
    catch(error){
      console.error("Failed to delete goal: ", error);
    }
  }

  // before touching api route, make sure page.tsx can 
  // update the goal inside goals state,
  // this means, to find the goal with this id,
  // replace its title and description, but 
  // leave every other goal unchanged 
  // then we can pass it into GoalCard.tsx
  async function handleUpdateGoal(
    goalId: string,
    updatedTitle: string,
    updatedDescription: string,
  ){
    try{
      const updatedGoal = await updateGoal(goalId, {
        title: updatedTitle,
        description: updatedDescription
      });

      setGoals((currentGoals) => 
        currentGoals.map((goal)=>
          goal.id === goalId ? updatedGoal : goal
        )
      );
  }
  catch(error){
    console.error("Failed to update goal: ", error)
  }
  }

  async function handleUpdateTask(taskId: string, updatedTitle: string){
    console.log("handleUpdateTask called: ", taskId, updatedTitle)
    try{
      const updatedTask = await updateTask(taskId, {
        title: updatedTitle,
      });

      setGoals((currentGoals) =>
        currentGoals.map((goal)=> ({
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id === taskId ? updatedTask : task
          ),
        }))
      );
    }
    catch(error){
      console.error("Failed to update task: ", error)
    }
    
  }

  async function handleDragEnd(event: DragEndEvent){
    // uses helper function saveGoalOrder()
    const {active, over} = event;
    if(!over) {
      return;
    }
    if(active.id === over.id){
      return;
    }

    const oldIndex = goals.findIndex((goal)=> goal.id === active.id);
    const newIndex = goals.findIndex((goal)=> goal.id === over.id);

    if (oldIndex === -1 || newIndex === -1){
      return;
    }

    const reorderedGoals = arrayMove(goals, oldIndex, newIndex);

    setGoals(reorderedGoals);

    await saveGoalOrder(reorderedGoals);


  }

  async function saveGoalOrder(reorderedGoals: typeof goals){
    // since drag and drop menu buttons both reorder goals
    // it helps to make 1 helper function
    // used by handleDragEnd and 
    try{
      const response = await fetch("/api/goals/reorder", {
        method: "PATCH",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalIds: reorderedGoals.map((goal)=> goal.id)
        }),
      });

      if(!response.ok){
        const errorData = await response.json();
        console.error("Reorder response status:", response.status);
        console.error("Reorder response body:", errorData);
        throw new Error("Failed to save goal order");
      }
    }
    catch(error){
      console.error("Failed to save goal order: ", error)
    }
  }

  async function moveGoalToTop(goalId: string){
    // brings a certain goal to the first position of the
    // goal array

    const oldIndex = goals.findIndex((goal)=> goal.id === goalId);
    if (oldIndex <= 0){ // if the goal is already at the top
      return;
    }
    const goalToMove = goals[oldIndex];
    const reorderedGoals = [
      goalToMove,
      ...goals.filter((goal)=> goal.id !== goalId)
    ] // puts goal first, then maps goals where goalid isnt the goal

    setGoals(reorderedGoals); //maps goals to dash
    await saveGoalOrder(reorderedGoals);
  }

  async function moveGoalUp(goalId: string){
    const oldIndex = goals.findIndex((goal)=> goal.id === goalId);
    if(oldIndex <= 0){ //if the goal is already at the top
      return;
    }
    const reorderedGoals = arrayMove(goals, oldIndex, oldIndex - 1)
    // make the goal go up one
    setGoals(reorderedGoals); // put them on dash
    await saveGoalOrder(reorderedGoals) // save them in database
  }

  async function moveGoalToBottom(goalId: string){
    const oldIndex = goals.findIndex((goal)=> goal.id === goalId);
    if(oldIndex === -1 || oldIndex >= goals.length - 1){ // if last in the array already
      return;
    }

    const goalToMove = goals[oldIndex];
    const reorderedGoals = [
      ...goals.filter((goal)=> goal.id !== goalId),
      goalToMove
    ]
    setGoals(reorderedGoals);
    await saveGoalOrder(reorderedGoals);
  }

  async function moveGoalDown(goalId: string){
    const oldIndex = goals.findIndex((goal)=> goal.id === goalId);
    if(oldIndex === -1 || oldIndex >= goals.length -1){
      return;
    }

    const goalToMove = goals[oldIndex];
    const reorderedGoals = arrayMove(goals, oldIndex, oldIndex + 1);
    setGoals(reorderedGoals);
    await saveGoalOrder(reorderedGoals);
  }

  async function handleArchiveGoal(goalId: string){
    const confirmed = window.confirm(
      "Archive thi sgoal? It will be removed from your dashboard but can be restored later."
    );

    if(!confirmed){
      return;
    }
    try{
      await archiveGoal(goalId);
      //removes the archived goal from the dashboard immediately
      // only removes after await succeeds
      setGoals((currentGoals)=>
        currentGoals.filter((goal)=> goal.id !== goalId)
      );

    }
    catch(error){
      console.error("Failed to archive goal: ", error)
    }
  }

  //three dot menu open / close state
  //    null = no menu open
  //    goal.id = this goal's menu is open
  const [openGoalMenuId, setOpenGoalMenuId] = useState<string | null>(null);

  // async function handleReorderTasks(
  //   goalId: string,
  //   activeTaskId: string,
  //   overTaskId: string
  // ) {
  //   const targetGoal = goals.find(
  //     (goal) => goal.id === goalId
  //   );

  //   if (!targetGoal) {
  //     return;
  //   }

  //   const oldIndex = targetGoal.tasks.findIndex(
  //     (task) => task.id === activeTaskId
  //   );

  //   const newIndex = targetGoal.tasks.findIndex(
  //     (task) => task.id === overTaskId
  //   );

  //   console.log("Task reorder indexes:", {
  //     oldIndex,
  //     newIndex,
  //     activeTaskId,
  //     overTaskId,
  //   });

  //   if (oldIndex === -1 || newIndex === -1) {
  //     return;
  //   }

  //   const previousTasks = targetGoal.tasks;

  //   const reorderedTasks = arrayMove(
  //     targetGoal.tasks,
  //     oldIndex,
  //     newIndex
  //   );

  //   const reorderedTaskIds = reorderedTasks.map(
  //     (task) => task.id
  //   );

  //   console.log("Sending task order:", reorderedTaskIds);

  //   setGoals((currentGoals) =>
  //     currentGoals.map((goal) =>
  //       goal.id === goalId
  //         ? {
  //             ...goal,
  //             tasks: reorderedTasks,
  //           }
  //         : goal
  //     )
  //   );

  //   try {
  //     const savedTasks = await reorderTasks(
  //       goalId,
  //       reorderedTaskIds
  //     );

  //     console.log(
  //       "Saved database order:",
  //       savedTasks.map((task) => ({
  //         id: task.id,
  //         order: task.order,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Failed to reorder tasks:", error);

  //     setGoals((currentGoals) =>
  //       currentGoals.map((goal) =>
  //         goal.id === goalId
  //           ? {
  //               ...goal,
  //               tasks: previousTasks,
  //             }
  //           : goal
  //       )
  //     );
  //   }
  // }

  async function handleReorderTasks(
    goalId: string,
    activeTaskId: string,
    overTaskId: string
  ) {
    const targetGoal = goals.find(
      (goal) => goal.id === goalId
    );

    if (!targetGoal) {
      return;
    }

    const oldIndex = targetGoal.tasks.findIndex(
      (task) => task.id === activeTaskId
    );

    const newIndex = targetGoal.tasks.findIndex(
      (task) => task.id === overTaskId
    );

    console.log("Task reorder indexes:", {
      oldIndex,
      newIndex,
      activeTaskId,
      overTaskId,
    });

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousTasks = targetGoal.tasks;

    const reorderedTasks = arrayMove(
      targetGoal.tasks,
      oldIndex,
      newIndex
    );

    const reorderedTaskIds = reorderedTasks.map(
      (task) => task.id
    );

    console.log("Sending task order:", reorderedTaskIds);

    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              tasks: reorderedTasks,
            }
          : goal
      )
    );

    try {
      const savedTasks = await reorderTasks(
        goalId,
        reorderedTaskIds
      );

      console.log(
        "Saved database order:",
        savedTasks.map((task) => ({
          id: task.id,
          order: task.order,
        }))
      );
    } catch (error) {
      console.error("Failed to reorder tasks:", error);

      setGoals((currentGoals) =>
        currentGoals.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                tasks: previousTasks,
              }
            : goal
        )
      );
    }
  }

  if(loading){
    return(
      <main className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-neutral-400">
                  Loading archived goals...
              </p>
              <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-16 w-16 animate-ping rounded-full bg-teal-200/10" />
                  <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-teal-200" />
              </div>
          </div>
      </main>
    );
  }
  if (error){
    return<main>{error}</main>
  }

 return (
  <main className="mx-auto min-h-screen w-full max-w-[900px] px-4 py-8 sm:px-6 lg:px-10">
    {/* <header className="mb-8">
      <h1 className="text-3xl text-neutral font-bold ">Memotive Dashboard</h1>
      <p className="text-neutral-100 font-bold">Track your goals, tasks, and progress.</p>
    </header> */}

    {/* Header and metadata */}
    <div className="rounded-lg border border-teal-200 bg-neutral-900 p-6 shadow mb-4">
        <h1 className="text-3xl text-center font-bold text-teal-200">
            Memotive Dashboard
        </h1>
        <p className="text-neutral-100 text-center font-bold mt-3">Track your goals, tasks, and progress.</p>
        <div className="mt-2  flex items-center gap-3">
            <span className="flex items-center  rounded-full bg-teal-200 px-2 py-2 text-sm font-bold text-black">
            </span>
            <p className=" text-neutral-400">
                {goals.length} {" "}
                {goals.length === 1 ? "Goal Displayed" : "Goals Displayed"}
            </p>
            <p>
              tag filter will be below here
            </p>
        </div>
    </div>

    {/* form for adding a goal */}
    {/* actually connects the form to function*/}
    <AddGoalForm
      title={title}
      description={description}
      setTitle={setTitle}
      setDescription={setDescription}
      handleCreateGoal={handleCreateGoal}
    />
    
    <div className=" space-y-6">
      {/* drag and drop wrapper */}
      <DndContext 
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          // tells dnd-kit that they are sorted on the goal array
          items={goals.map((goal)=> goal.id)}
          strategy={verticalListSortingStrategy}
        >
          {/* list all the goals (GoalCard component) */}
          {goals.map((goal) => (
            <GoalCard
              // this is all passed to GoalCard.tsx, including 
              // functions defined here in page.tsx
              key={goal.id}
              goal={goal}
              openGoalMenuId={openGoalMenuId}
              setOpenGoalMenuId={setOpenGoalMenuId}
              handleDeleteGoal={handleDeleteGoal}
              handleToggleTask={handleToggleTask}
              handleCreateTask={handleCreateTask}
              handleDeleteTask={handleDeleteTask}
              handleUpdateGoal={handleUpdateGoal}
              taskTitles={taskTitles}
              setTaskTitles={setTaskTitles}
              handleUpdateTask={handleUpdateTask}
              onMoveToTop={moveGoalToTop}
              onMoveUp={moveGoalUp}
              onMoveDown={moveGoalDown}
              onMoveToBottom={moveGoalToBottom}
              handleArchiveGoal={handleArchiveGoal}
              handleReorderTasks={handleReorderTasks}
            />
          ))} 
        </SortableContext>
      </DndContext>
    </div>
  </main>
);
}


// Works because in the App Router, pages are Server 
// Components by default, so page can directly fetch 
// server side data.For API-style endpoints later, Next.js 
// uses Route Handlers inside the app directory, supporting
// methods like GET POST PUT PATCH DELETE
