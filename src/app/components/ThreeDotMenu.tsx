//imports

// types 


type ThreeDotMenuProps = {
    itemId: string;
    openMenuId: string | null;
    setOpenMenuId: (itemId: string | null) => void;
    onDelete: (itemId: string) => void;
}
//function

export default function ThreeDotMenu({
    itemId,
    openMenuId,
    setOpenMenuId,
    onDelete
}: ThreeDotMenuProps){
    return(
        <>
            {/* MENU OPTION BUTTON */}
            <button
            type="button"
            onClick={()=> setOpenMenuId(openMenuId === itemId ? null : itemId)}
            className="absolute right-4 top-4 rounded px-2 py-1 bg-teal-200 font-medium text-black hover:bg-teal-200"
            >
                ...
            </button>
            
            {openMenuId === itemId && (
            <div className="absolute right-4 top-12 z-10 w-32 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-lg">
                <button
                type="button"
                className="block w-full rounded px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700"
                >
                    Edit
                </button>

                <button
                type="button"
                onClick={() =>onDelete(itemId)}
                className="block w-full rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-700"
                >
                    Delete
                </button>
            </div>
        )}
        </>
    )
}