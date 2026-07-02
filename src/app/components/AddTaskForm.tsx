"use client";

type AddTaskFormProps = {
    goalId: string;
    taskTitles: Record<string, string>
    setTaskTitles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleCreateTask: (
        event: React.FormEvent<HTMLFormElement>,
        goalId : string
    ) => void;
};


export default function AddTaskForm({
    goalId,
    taskTitles,
    setTaskTitles,
    handleCreateTask,
}: AddTaskFormProps){
    return(
        <form onSubmit={(event)=> handleCreateTask(event, goalId)}>
            <input
                className="rounded border border-black bg-teal-200 px-3 py-2 text-black placeholder:text-black"
                value= {taskTitles[goalId] || ""}
                onChange={(event)=> 
                setTaskTitles((currentTaskTitles) => ({
                    ...currentTaskTitles,
                    [goalId]: event.target.value,
                }))
                }
                placeholder="New Task"
            />
        </form>
    )
}