"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/signin" });
    };

    if (!mounted) {
        // Return a simple navbar during SSR
        return (
            <nav className="bg-black text-green-400 border-b border-green-500/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link
                        href="/"
                        className="text-2xl font-extrabold tracking-wide text-green-400 hover:text-green-300 transition"
                    >
                        SecureVault
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="hover:text-green-300 transition font-medium">
                            Home
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    const isAuthenticated = status === "authenticated";

    const links = isAuthenticated
        ? [
            { href: "/", label: "Home" },
            { href: "/passwordgenerator", label: "Generator" },
            { href: "/passwordvault", label: "Vault" },
        ]
        : [
            { href: "/", label: "Home" },
            { href: "/signin", label: "Sign In" },
            { href: "/signup", label: "Sign Up" },
        ];

    return (
        <nav className="bg-black text-green-400 border-b border-green-500/30 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-2xl font-extrabold tracking-wide text-green-400 hover:text-green-300 transition"
                >
                    SecureVault
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="hover:text-green-300 transition font-medium"
                        >
                            {label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Logout
                        </button>
                    )}
                </div>

                <button
                    className="md:hidden text-green-400 hover:text-green-300 transition"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {open && (
                <div className="md:hidden flex flex-col space-y-3 px-6 pb-4 border-t border-green-500/20 bg-neutral-950">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="hover:text-green-300 transition font-medium"
                        >
                            {label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button
                            onClick={() => {
                                handleLogout();
                                setOpen(false);
                            }}
                            className="text-left bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}