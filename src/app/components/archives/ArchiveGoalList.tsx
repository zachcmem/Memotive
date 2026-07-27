// import ArchivedGoalCard

import type { ArchivedGoal } from "@/types"
import ArchiveGoalCard from "./ArchiveGoalCard"

type ArchivedGoalListProps = {
    goals: ArchivedGoal[];
    expandedGoalIds: string[];
    processingGoalIdRestore: string | null;
    processingGoalIdDelete: string | null;
    onToggleGoal: (goalId: string) => void;
    onRestoreGoal: (goalId: string) => void;
    onDeleteGoal: (goalId: string) => void;
}

export default function ArchiveGoalList({
    goals,
    expandedGoalIds,
    processingGoalIdRestore,
    processingGoalIdDelete,
    onToggleGoal,
    onRestoreGoal,
    onDeleteGoal,
}:ArchivedGoalListProps){
    return(
  
        <section className="w-full space-y-6">
            {goals.map((goal)=> (
                <ArchiveGoalCard
                    key = {goal.id}
                    goal = {goal}
                    isExpanded={expandedGoalIds.includes(goal.id)}
                    onToggle={()=> onToggleGoal(goal.id)}
                    onRestore={()=> onRestoreGoal(goal.id)}
                    onDelete={()=> onDeleteGoal(goal.id)}
                    isRestoring={processingGoalIdRestore === goal.id}
                    isDeleting={processingGoalIdDelete === goal.id}
                />
            ))}
        </section>
    )
}