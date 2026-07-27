
// the search bar and sort component of the archive page
import type { SortOption} from "@/types";
//props that are passed in from archives page
type ArchiveToolBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    sortOption: SortOption;
    setSortOption: (value: SortOption) => void;
    visibleCount: number;
    totalCount: number;
}

export default function ArchiveToolBar({
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    visibleCount,
    totalCount
}: ArchiveToolBarProps){
    return(
        <>
            <section className="mt-4 mb-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <label
                            htmlFor="archive-search"
                            className="mb-2 block text-sm font-medium text-neutral-300"
                        >
                            Search archived goals
                        </label>
                        <input
                            id="archive-search"
                            type="search"
                            value={searchQuery}
                            onChange={(event)=> setSearchQuery(event.target.value)}
                            placeholder="Search Archives"
                            className="w-full rounded border border-neutral-700 bg-neutral-800 px-4 py-2 text-white outline-none transition placeholder:text-neutral-500 focus:border-teal-200"
                        />
                    </div>
                    <div className="sm:w-56">
                        <label
                            htmlFor="archive-sort"
                            className="mb-2 block text-sm font-medium text-neutral-300"
                        >
                            Sort by
                        </label>

                        <select
                            id="archive-sort"
                            value={sortOption}
                            onChange={(event)=> 
                                setSortOption(event.target.value as typeof sortOption)
                            }
                            className="w-full rounded border border-neutral-700 bg-neutral-800 px-4 py-2 text-white outline-none transition focus:border-teal-200"
                        >
                            <option value="archived-newest">
                                Newest archived
                            </option>

                            <option value="archived-oldest">
                                Oldest archived
                            </option>

                            <option value="title-asc">
                                Title: A-Z
                            </option>

                            <option value="title-desc">
                                Title: Z-A
                            </option>

                            <option value="progress-high">
                                Highest progress
                            </option>

                            <option value="progress-low">
                                Lowest progress
                            </option>
                        </select>        
                    </div>
                </div>
            
                <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
                    <p>
                        Showing {visibleCount} of{" "}
                        {totalCount} archived goals
                    </p>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="font-medium text-teal-200 transition hover:text-white"
                        >
                        Clear Search
                        </button>
                    )}                     
                </div>
            </section>
        </>
    );
}