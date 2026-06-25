// MAIN PAGE -> DEEP DIVE

// REMOVED STATIC DATABASE MODULE
// 6-25 ADDED Client-side fetch with useEffect
//  Put prisma fetch into API ROUTES layer


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
  useEffect(()=> {
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
    fetchGoals();
  
  }, []);

  if(loading){
    return<main>Loading Goals...</main>
  }
  if (error){
    return<main>{error}</main>
  }

  return (
    <main>
      <h1>Memotive Dashboard</h1>
      {goals.map((goal)=>(
        <section key={goal.id}>
          <h2>{goal.title}</h2>
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
