// import ArchivedGoalCard

import type { ArchivedGoal } from "@/types"

type ArchivedGoalListProps = {
    goals: ArchivedGoal[];
    expandedGoalIds: string[];
    onToggleGoal: (goalId: string) => void;
    onRestoreGoal: (goalId: string) => void;
    onDeleteGoal: (goalId: string) => void;
}

export default function ArchiveGoalList({
    goals,
    expandedGoalIds,
    onToggleGoal,
    onRestoreGoal,
    onDeleteGoal
}:ArchivedGoalListProps){
    return(
        <>
        <section className="space-y-6">
            {goals.map((goal)=> {
                const isExpanded = expandedGoalIds.includes(goal.id);
                
                return(
                    <article
                        key={goal.id}
                        className="rounded-lg mt-4 border border-teal-200 bg-neutral-900 p-6 shadow"
                    >
                        {/* always visable */}
                        <div className=" mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-2xl font-semibold text-white">
                            {goal.title}
                            </h2>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={()=> onToggleGoal(goal.id)}
                                    aria-expanded={isExpanded}
                                    className="rounded bg-white px-2 py-0.5 font-medium text-black transition hover:bg-teal-200"
                                >
                                    {isExpanded ? "-" : "+"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDeleteGoal(goal.id)}
                                    disabled={processingGoalIdDelete === goal.id}
                                    className="rounded bg-white px-1.5 py-0.5 font-medium text-black transition hover:bg-red-300"
                                >
                                    {/* // changes label in action run*/}
                                    {processingGoalIdDelete === goal.id ? "Deleting Goal..." : "✖"}
                                </button>
                            </div>
                        </div>

                        {isExpanded && (    
                            <div className="mt-3">    
                                {/* if theres a goal description */}
                                {goal.description && (
                                    <p className="mt-2 text-neutral-300">
                                        {goal.description}
                                    </p>
                                )}
                                
                                {/* progress bar component*/}
                                <ProgressBar progress={goal.progress}/>

                                <div className="mt-5">
                                    <h3 className="mb-1 font-bold font-medium  text-white">
                                        Tasks
                                    </h3>

                                    { goal.tasks.length === 0 ? (
                                        // if theres tasks for this goal
                                        <p className="text-sm text-neutral-500">
                                            This goal has no tasks
                                        </p>
                                    ) : (
                                        // if there are tasks for this goal, list them
                                        // tasks summary
                                        <>
                                            <p className="mb-2 text-sm text-neutral-400">
                                                {goal.tasks.filter((task)=> task.completed).length} of{" "}
                                                {goal.tasks.length} tasks completed
                                            </p>
                                        
                                            <ul className="space-y-2">
                                                {goal.tasks.map((task)=>(
                                                    <li
                                                        key={task.id}
                                                        className="flex items-center gap-3 rounded bg-neutral-800 px-4 py-3"
                                                    >
                                                    <span
                                                        className={`h-3 w-3 rounded-full ${
                                                            task.completed
                                                                ? "bg-teal-200"
                                                                : "bg-neutral-500"
                                                        }`}
                                                    />
                                                    <span
                                                        className={
                                                            task.completed
                                                                ? "text-neutral-400 line-through"
                                                                : "text-neutral-200"
                                                        }
                                                    >
                                                        {task.title}
                                                    </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            
                            </div>
                        )}
                        
                            
                        {/* archived goal information */}
                        {goal.archivedAt &&(
                            <p className="mt-5 text-sm text-neutral-500">
                                Archived on{" "}
                                {new Date(goal.archivedAt).toLocaleDateString(undefined, {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        )} 
                        <button
                            type="button"
                            onClick={()=> handleRestoreGoal(goal.id)}
                            className="text-sm text-teal-300 hover:text-teal-200 hover:underline"
                            disabled={processingGoalIdRestore === goal.id}
                        >   
                            {processingGoalIdRestore === goal.id ? "Restoring..." : "Restore Goal"}
                        </button>    
                    </article>
                )
            })}
        </section>
        </>
    )
}