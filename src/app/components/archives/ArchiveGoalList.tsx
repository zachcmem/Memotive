// import ArchivedGoalCard

import type { ArchivedGoal } from "@/types"
import ArchiveGoalCard from "./ArchiveGoalCard"

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
    onDeleteGoal,
}:ArchivedGoalListProps){
    return(
  
        <section className="space-y-6">
            {goals.map((goal)=> (
                <ArchiveGoalCard
                    key = {goal.id}
                    goal = {goal}
                    isExpanded={expandedGoalIds.includes(goal.id)}
                    onToggle={()=> onToggleGoal(goal.id)}
                    onRestore={()=> onRestoreGoal(goal.id)}
                    onDelete={()=> onDeleteGoal(goal.id)}
                />
            ))}
        </section>
    )
}