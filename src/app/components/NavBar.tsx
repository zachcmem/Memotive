
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    // retrieves current route
    const pathname = usePathname();

    // boolean controls whether the mobile menu is visible
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleMobileLinkClick(){
        setIsMenuOpen(false);
    }

    return(
        <header className="border-b border-neutral-800 bg-neutral-950">
            <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Name of Application */}
                    <Link
                        href="/"
                        onClick={handleMobileLinkClick}
                        className="text-xl font-bold tracking-wide text-teal-200"
                    >
                        Memotive
                    </Link>
                    {/* Desktop Navigation */}
                    <div className="flex items-center gap-8">
                        {/* maps the link array above */}
                        {navigationLinks.map((link) => {
                            //compare each link with selected link
                            const isActive = pathname === link.href;

                            return(
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    //Using a transparent border on inactive links prevents
                                    //  the navbar text from slightly shifting when a link 
                                    // becomes active.
                                    className={`border-b-2 pb-1 text-sm font-medium transition ${
                                        isActive
                                            ? "border-teal-200 text-teal-200"
                                            : "border-transparent text-neutral-300 hover:text-teal-200"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        }
                            
                        )}
                    </div>
                    {/* Temporary account button */}
                    <button
                        type="button"
                        aria-label="Open Account Menu"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-semibold text-black transition hover:bg-teal-200"
                    >
                        Z
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                        onClick={()=> setIsMenuOpen((current)=> !current)}
                    >
                        {isMenuOpen ? (
                            //Close icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
                                <path d="M6 6l12 12M18 6L6 18"/>
                            </svg>
                        ):(
                            // Hameburger Icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
                
                {isMenuOpen && (
                    <div className="mt-4 border-t border=neutral-800 pt-4 md:hidden">
                        <div className="flex flex-col gap-2">
                            {navigationLinks.map((link)=>{
                                const isActive = pathname === link.href;

                                return(
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={handleMobileLinkClick}
                                        className={`rounded px-3 py-2 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-teal-200 text-black"
                                                : "text-neutral-300 hover:bg-neutral-800 hover:text-teal-200"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <button
                                type="button"
                                className="mt-2 flex items-center gap-3 rounded px-3 py-2 text-left text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-teal-200"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-semibold text-black">
                                    Z
                                </span>
                                <span>Account</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}