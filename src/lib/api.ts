// FRONTEND API client 
// helps keep page.component files from becoming crowded

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
    const response = await fetch("/api/task", {
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

export async function toggleTask( taskId: string){
    const response = await fetch(`api/tasks/${taskId}`,{
        method: "PATCH",
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