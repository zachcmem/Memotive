"use client";

type AddGoalFormProps = {
    title: string;
    description: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    handleCreateGoal: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function AddGoalForm({
    title, 
    description,
    setTitle,
    setDescription,
    handleCreateGoal,
}: AddGoalFormProps){
    return(
        <section className="mb-8 rounded-lg bg-neutral-900 border border-teal-200 p-6 shadow space-y-6">
              <form onSubmit={handleCreateGoal}> 
                <input
                  // without onChange, typing wont update react state
                  className="rounded border border-black bg-teal-200 px-3 py-2 text-black placeholder:text-black"
                  value={title}
                  onChange={(event)=> setTitle(event.target.value)}
                  placeholder="Goal title"
                />
                &nbsp;&nbsp;
                <input
                  className="rounded border border-black bg-teal-200 px-3 py-2 text-black placeholder:text-black"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Goal description"
                />
                &nbsp;&nbsp;
                <button className="rounded bg-white px-4 py-2 font-medium text-black hover:bg-teal-200 space-y-6" type="submit">Create Goal</button>
              </form>
            </section>
    )
}