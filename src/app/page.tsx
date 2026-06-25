// MAIN PAGE -> DEEP DIVE

// REMOVED STATIC DATABASE MODULE
// 6-25 ADDED Client-side fetch with useEffect
//  Put prisma fetch into API ROUTES layer
//  This is not the final pretty dashboard. This is just the
//  first real connection between your frontend and backend.
// 6-25 ADDED Create Goal Function 
"use client"; //  is a React directive that marks the boundary between server-rendered and client-rendered code. It tells the bundler to ship a component's JavaScript to the browser, making it interactive
import {useEffect, useState } from "react"

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
    await  fetchGoals(); //made this global
  }

  if(loading){
    return<main>Loading Goals...</main>
  }
  if (error){
    return<main>{error}</main>
  }

 return (
  <main>
    <h1>Memotive Dashboard</h1>
    {/* form for adding a goal */}
    {/* actually connects the form to function*/}
    <form onSubmit={handleCreateGoal}> 
      <input
        value={title}
        onChange={(event)=> setTitle(event.target.value)}
        placeholder="Goal title"
      />
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Goal description"
      />
      <button type="submit">Create Goal</button>
    </form>
    {/* added for error check */}
    <p>Goal count: {goals.length}</p> 
    {goals.map((goal) => (
      <section key={goal.id}>
        <h2>{goal.title}</h2>
        <p>{goal.description}</p>
        <p>Progress: {goal.progress}%</p>
        <p>Tasks: {goal.tasks.length}</p>
      </section>
    ))}
  </main>
);
}


// Works because in the App Router, pages are Server 
// Components by default, so page can directly fetch 
// server side data.For API-style endpoints later, Next.js 
// uses Route Handlers inside the app directory, supporting
// methods like GET POST PUT PATCH DELETE
