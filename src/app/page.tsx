
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
} from "@/lib/api";

// Tells TypeScript about the SHAPE OF DATA
//    Later when we map the goals to the dash, type knows what goals contain
// Task should have an id, title, and boolean
type Task = {
  id: string
  title: string
  completed: boolean
}
type Goal = {
  id: string;
  title: string;
  description?: string | null;
  progress: number;
  tasks: Task[]
}

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
      setGoals((currentGoals) => [...currentGoals, newGoal]);
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
        currentGoals.map((goal)=>
          goal.id === goalId
            ?{
              ... goal,
              tasks:[...goal.tasks, newTask],
            }
            : goal
        )
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

  async function handleToggleTask(taskId: string){

    try{
      const updatedTask = await toggleTask(taskId);
      setGoals((currentGoals) => 
        currentGoals.map((goal) => ({
          ...goal,
          tasks: goal.tasks.map((task)=>
            task.id === taskId ? updatedTask : task
          ),
        }))
      );
    }
    catch(error){
      console.error("Failed to toggle task: ", error);
    }
  }

  async function handleDeleteTask(taskId: string){
    try{
      await deleteTask(taskId);
      setGoals((currentGoals) =>
        currentGoals.map((goal)=>({
          ...goal,
          tasks: goal.tasks.filter((task) => task.id !== taskId),
        }))
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

  //three dot menu open / close state
  //    null = no menu open
  //    goal.id = this goal's menu is open
  const [openGoalMenuId, setOpenGoalMenuId] = useState<string | null>(null);

  if(loading){
    return<main>Loading Goals...</main>
  }
  if (error){
    return<main>{error}</main>
  }

 return (
  <main className="min-h-screen bg-black text-white p-8">
    <header className="mb-8">
      <h1 className="text-3xl text-neutral font-bold ">Memotive Dashboard</h1>
      <p className="text-neutral-100 font-bold">Track your goals, tasks, and progress.</p>
    </header>
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
          taskTitles={taskTitles}
          setTaskTitles={setTaskTitles}
        />
      ))}
    </div>
  </main>
);
}


// Works because in the App Router, pages are Server 
// Components by default, so page can directly fetch 
// server side data.For API-style endpoints later, Next.js 
// uses Route Handlers inside the app directory, supporting
// methods like GET POST PUT PATCH DELETE
