"use client";

import {CSS} from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable";

// WHAT THIS COMPONENT DOES

// useSortable() gives each task a sortableId, draglisteners,
// dragattributes, position transformations, transition animations,
// and a dragging state. 

type SortableTaskItemProps = {
    taskId: string;
    disabled?: boolean;
    children: React.ReactNode;
};

export default function SOrtableTaskItem({
    taskId,
    disabled = false,
    children,
}:SortableTaskItemProps){
    // this part connects the rendered task to dnd-kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: taskId,
        disabled,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return(
        <div
            // this teslls dnd-kit which element should move
            ref={setNodeRef}
            style={style}
            className={`relative ${
                isDragging ? "z-20 opacity-60" : ""
            }`}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                disabled={disabled}
                aria-label="Reorder task"
                className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded px-2 py-1 text-sm transition ${
                    disabled
                        ? "cursor-not-allowed bg-neutral-700 text-neutral-500"
                        : "cursor-grab bg-white text-black hover:bg-teal-200 active:cursor-grabbing"
                    }`}

            >
                ↕
            </button>
        </div>      
    );
}
