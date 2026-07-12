
type GoalReorderMenuProps = {
    goalId: string
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onMoveToTop: (goalId: string) => void;
    onMoveUp: (goalId: string)=> void;
    onMoveDown: (goalId: string)=> void;
    onMoveToBottom: (goalId: string)=> void;
}

export default function GoalOrderMenu({
    goalId,
    isOpen,
    setIsOpen,
    onMoveToTop,
    onMoveUp,
    onMoveDown,
    onMoveToBottom,
}: GoalReorderMenuProps){
    return(
        <>
            <button
                type="button"
                onClick={()=> setIsOpen((current)=> !current)}
                className="rounded px-2 py-1 bg-white font-medium text-black hover:bg-teal-200"
                aria-label="Open reorder menu"
            >
                ☰
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-39 rounded rounded-lg border border-teal-200 bg-slate-800 p-2 shadow-lg">
                    <button
                        type="button"
                        onClick={()=> {
                            onMoveToTop(goalId);
                            setIsOpen(false);
                        }}
                        className="mb-2 block w-full rounded px-3 py-2 text-left text-sm text-black bg-white font-bold hover:bg-teal-200"
                    >
                        Send to Top
                    </button>
                    <button
                        type="button"
                        onClick={()=> {
                            onMoveUp(goalId);
                            setIsOpen(false);
                        }}
                        className="mb-2 block w-full rounded px-3 py-2 text-left text-sm text-black bg-white font-bold hover:bg-teal-200"
                    >
                        Move Up 1
                    </button>
                    <button
                        type="button"
                        onClick={()=> {
                            onMoveDown(goalId);
                            setIsOpen(false);
                        }}
                        className="mb-2 block w-full rounded px-3 py-2 text-left text-sm text-black font-bold bg-white hover:bg-teal-200"
                    >
                        Move Down 1
                    </button>
                    <button
                        type="button"
                        onClick={()=> {
                            onMoveToBottom(goalId);
                            setIsOpen(false);
                        }}
                        className="block w-full rounded px-3 py-2 text-left text-sm text-black bg-white font-bold hover:bg-teal-200"
                    >
                        Move To Bottom
                    </button>
                </div>
            )}
        </>
                
    )
}