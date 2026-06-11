// held in lib, holds reusable, core logic that doesnt depend on your apps specific buisness rules
// utility file -> contains helper functions and reusable code
//NEEDS DEEP DIVE
type TaskLike = {
    completed: boolean;
};

export function calculateProgress( tasks: TaskLike[]){
    if (tasks.length === 0) {
        return 0;
    }

    const completedTasks = tasks.filter((task)=> task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
}

