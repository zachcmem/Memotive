// FRONTEND API client 
// helps keep page.component files from becoming crowded

import type { Task } from "@/types";

export async function createGoal(title: string, description: string){
    const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            description
        }),
    });

    if (!response.ok){
        throw new Error("Failed to create goal");
    }

    return response.json();
}

export async function deleteGoal(goalId: string){
    const response = await fetch(`/api/goals/${goalId}`,{
        method: "DELETE",
    });

    if (!response.ok){
        throw new Error("Failed to delete goal");
    }

    return response.json();
}

export async function createTask(goalId: string, title: string){
    const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            goalId,
            title
        }),
    });

    if (!response.ok){
        throw new Error("Failed to create task");
    }
    return response.json();
}

//calls PATCH function but only update completed
export async function toggleTask( 
    taskId: string,
    completed: boolean,
){
    const response = await fetch(`api/tasks/${taskId}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            completed,
        }),
    });

    if (!response.ok){
        throw new Error("Failed to toggle task");
    }
    return response.json();
}

export async function deleteTask(taskId: string){
    const response = await fetch(`api/tasks/${taskId}`,{
        method: "DELETE",
    });

    if (!response.ok){
        throw new Error("Failed to delete task");
    }
    return response.json();
}

export async function updateGoal(
    goalId: string,
    data: {
        title: string;
        description: string;
    }
) {
    const response = await fetch(`api/goals/${goalId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if(!response.ok){
        throw new Error("Failed to update goal");
    }

    return response.json();
}

// sends to the patch function, but only can update task title
export async function updateTask(
    taskId: string,
    data: {
        title: string;
    }
){
    const response = await fetch(`/api/tasks/${taskId}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok){
        throw new Error("Failed to update task")
    }
    return response.json()
}

//API helper for archive handling
export async function archiveGoal(goalId: string){
    const response = await fetch(`api/goals/${goalId}/archive`,{
        method: "PATCH"
    });
    if(!response.ok){
        throw new Error("Failed to archive goal")
    }
    return response.json();
}

export async function getArchivedGoals(){
    const response = await fetch("/api/archives");

    if(!response.ok){
        throw new Error("Failed to fetch archived goals");
    }

    return response.json();
}

//helper function for restoring goals
export async function restoreGoal(goalId: string){
    const response = await fetch(`/api/goals/${goalId}/restore`, {
        method: "PATCH",
    });
    if(!response.ok){
        throw new Error("Failed to restore goal");
    }
    return response.json()
}
export async function reorderTasks(
    goalId: string,
    taskIds: string[]
): Promise<Task[]>{
    console.log("Sending reorder request:", {
    goalId,
    taskIds,
  });
    const response = await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            goalId,
            taskIds,
        }),
    });

    if (!response.ok){
        const errorData = await response.json().catch(()=> null);
        throw new Error(
            errorData?.error || "Failed to reorder tasks"
        );
    }
    return response.json();
}