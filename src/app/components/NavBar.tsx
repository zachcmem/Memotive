
import Link from "next/link";

const navigationLinks = [
    {
        label: "Dashboard",
        href: "/"
    },
    {
        label: "Stats",
        href:"/stats"
    },
    {
        label: "Archives",
        href: "/archives"
    },
    {
        label: "Templates",
        href: "/templates"
    },
];

export default function Navbar(){
    return(
        <header className="border-b border-neutral-800 bg-neutral-950">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                {/* Name of Application */}
                <Link
                    href="/"
                    className="text-xl font-bold tracking-wide text-teal-200"
                >
                    Memotive
                </Link>
                {/* Page Navigation */}
                <div className="flex items-center gap-8">
                    {/* maps the link array above */}
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-neutral-300 transition hover:text-teal-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                Temporary account button
                <button
                    type="button"
                    aria-label="Open Account Menu"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-semibold text-black transition hover:bg-teal-200"
                >
                    A
                </button>
            </nav>
        </header>
    )
}