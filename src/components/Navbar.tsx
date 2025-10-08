"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/signin" });
    };

    if (!mounted) {
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
        <nav className="bg-black dark:bg-white text-green-400 dark:text-green-700 border-b border-green-500/30 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-extrabold tracking-wide text-green-400 hover:text-green-300 dark:text-green-700 dark:hover:text-green-600 transition"
                >
                    SecureVault
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="hover:text-green-300 dark:hover:text-green-600 transition font-medium"
                        >
                            {label}
                        </Link>
                    ))}

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full bg-neutral-900 dark:bg-gray-200 hover:bg-neutral-800 dark:hover:bg-gray-300 transition"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-green-400 dark:text-green-700" />
                        ) : (
                            <Moon className="w-5 h-5 text-green-500 dark:text-green-700" />
                        )}
                    </button>

                    {/* Logout */}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-green-400 hover:text-green-300 transition"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden flex flex-col space-y-3 px-6 pb-4 border-t border-green-500/20 bg-neutral-950 dark:bg-gray-100">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="hover:text-green-300 dark:hover:text-green-600 transition font-medium"
                        >
                            {label}
                        </Link>
                    ))}

                    {/* Theme Toggle (mobile) */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex items-center gap-2 p-2 rounded-md bg-neutral-900 dark:bg-gray-200 hover:bg-neutral-800 dark:hover:bg-gray-300 transition"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-green-400 dark:text-green-700" />
                        ) : (
                            <Moon className="w-5 h-5 text-green-500 dark:text-green-700" />
                        )}
                        <span>Toggle Theme</span>
                    </button>

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
