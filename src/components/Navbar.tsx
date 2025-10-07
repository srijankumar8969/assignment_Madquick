"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-2xl font-bold tracking-wide">
            SecureVault
            </Link>
            <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-indigo-400 transition">Home</Link>
            <Link href="/passwordgenerator" className="hover:text-indigo-400 transition">Generator</Link>
            <Link href="/passwordvault" className="hover:text-indigo-400 transition">Vault</Link>
            </div>

            <button
            className="md:hidden text-gray-300"
            onClick={() => setOpen(!open)}
            >
            {open ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Menu */}
        {open && (
            <div className="md:hidden flex flex-col space-y-2 px-6 pb-4">
            <Link href="/" className="hover:text-indigo-400 transition">Home</Link>
            <Link href="/passwordgenerator" className="hover:text-indigo-400 transition">Generator</Link>
            <Link href="/passwordvault" className="hover:text-indigo-400 transition">Vault</Link>
            </div>
        )}
        </nav>
    );
}
