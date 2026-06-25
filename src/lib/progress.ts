// held in lib, holds reusable, core logic that doesnt depend on your apps specific buisness rules
// utility file -> contains helper functions and reusable code
//NEEDS DEEP DIVE
type TaskLike = {
    completed: boolean;
};

export function calculateProgress( tasks: TaskLike[]){ // takes in tasks
    // if there are no tasks
    if (tasks.length === 0) {
        return 0; // theres no progress
    }

    // calculate the completed task ratio:

    //make the variable for tasks completed
    const completedTasks = tasks.filter((task)=> task.completed).length;
    // return the ratio!
    return Math.round((completedTasks / tasks.length) * 100);
}

// export function getCompletedTaskCount(tasks){

// }

