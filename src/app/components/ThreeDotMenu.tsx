//imports
import { useEffect, useRef } from "react";

// types 


type ThreeDotMenuProps = {
    itemId: string;
    openMenuId: string | null;
    setOpenMenuId: (itemId: string | null) => void;
    onDelete: (itemId: string) => void;
    onEdit: () => void;
    onArchive: (itemId: string)=> void;
}
//function

export default function ThreeDotMenu({
    itemId,
    openMenuId,
    setOpenMenuId,
    onDelete,
    onEdit,
    onArchive
}: ThreeDotMenuProps){

    const menuRef = useRef<HTMLDivElement>(null);
    const isOpen = openMenuId === itemId;

    //own use effect because the other wasnt working
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;

        if (menuRef.current && !menuRef.current.contains(target)) {
            setOpenMenuId(null);
        }
        }

        if (isOpen) {
        document.addEventListener("click", handleClickOutside);
        }

        return () => {
        document.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen, setOpenMenuId]);

    return(
        <div ref={menuRef} className="absolute right-4 top-4">
            {/* MENU OPTION BUTTON */}
            <button
            type="button"
            onClick={(event)=> {
                event.stopPropagation();
                setOpenMenuId(openMenuId === itemId ? null : itemId);
            }}
            className="rounded px-2 py-1 bg-white font-medium text-black hover:bg-teal-200"
            >
                ...
            </button>
            
            {openMenuId === itemId && (
            <div className="absolute right-0 top-8 z-20 w-32 mt-2 rounded-lg border border-teal-200 bg-slate-800 p-2 shadow-lg">
                <button
                type="button"
                onClick={()=> {
                    console.log("Edit clicked");
                    onEdit(); 
                    setOpenMenuId(null);
                }}
                className="mb-2 block w-full rounded px-3 py-2 text-left text-sm text-black font-bold bg-white hover:bg-teal-200"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={(event)=> {
                        event.stopPropagation();
                        setOpenMenuId(null);
                        onArchive(itemId);
                    }}
                    className="mb-2 block w-full rounded px-3 py-2 text-left text-sm text-black font-bold bg-white hover:bg-teal-200"
                >
                    Archive
                </button>

                <button
                type="button"
                onClick={() => {
                    const confirmed = window.confirm(
                        "Are you sure you want to delete this goal? This will delete all of its tasks"
                    );
                    if (!confirmed) return;

                    onDelete(itemId)
                    setOpenMenuId(null);
                }}
                className="block w-full rounded px-3 py-2 text-left text-sm text-black font-bold bg-white hover:bg-red-300"
                >
                    Delete
                </button>
            </div>
            )}
        </div>
    )
}