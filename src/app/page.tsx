
"use client"; //  is a React directive that marks the boundary between server-rendered and client-rendered code. It tells the bundler to ship a component's JavaScript to the browser, making it interactive
import {useEffect, useState } from "react"
import GoalCard from "./components/GoalCard";
import AddGoalForm from "./components/AddGoalForm";

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
    // calls the POST endpoint here
    const response = await fetch( "/api/goals",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
    //prevents page from pretending goal was created if API failed
    if (!response.ok){
      console.error("Failed to create goal");
      return;
    }

    // clears the form after sucessful submit
    setTitle("");
    setDescription("");

    //refreshes dashboard with newest database data
    console.log("Goal created. Refetching goals...");
    await  fetchGoals(); //made this global
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
    // call our post function HERE
    const response = await fetch("/api/tasks",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      //this is sent to API
      body: JSON.stringify({
        title: taskTitle,
        goalId,
      }),

    });

    // error handling incase its not valid
    if (!response.ok) {
      console.error("Failed to create task");
      return;
    }

    //clears only that goals task input 
    setTaskTitles((currentTaskTitles)=>({
      ...currentTaskTitles,
      [goalId]: "",

    }));
    // refreshes dashboard
    await fetchGoals();
  }

  async function handleToggleTask(taskId: string){
    // calls the PATCH function
    const response = await fetch(`/api/tasks/${taskId}`,{
      method: "PATCH",
    });

    // error check response
    if (!response.ok){
      console.error("Failed to update task");
      return;
    }

    // refreshes dashboard
    await fetchGoals();
  }

  async function handleDeleteTask(taskId: string){
    //define the response, calls the DELETE function
    const response = await fetch(`/api/tasks/${taskId}`,{
      method: "DELETE",
    });

    //make sure the response came back alright
    if(!response.ok){
      console.error("Failed to delete task");
      return;
    }

    //refresh dashboard
    await fetchGoals();
  }

  async function handleDeleteGoal(goalId: string){
    const response = await fetch(`/api/goals/${goalId}`, {
      method: "DELETE",
    });

    // check if the response worked
    if(!response.ok){
      console.error("Failed to delete goal");
      return;
    }

    await fetchGoals();
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
