
// render
// does not need use client

//types
type ProgressBarProps={
    progress: number;
}

//function

export default function ProgressBar({
    progress
}: ProgressBarProps){
    return(
        <>
            <p className="mb-2 text-sm text-teal-200">
                        Progress: {progress}%
            </p>

            <div className="mb-2 h-3 w-full rounded-full bg-gray-200">
                <div
                    className=" h-3 rounded-full bg-teal-200"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </>
        
    );
}