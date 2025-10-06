"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

interface VaultItem {
    _id?: string;
    title: string;
    email: string;
    password: string;
    url?: string;
    notes?: string;
}

export default function VaultPage() {
    const [items, setItems] = useState<VaultItem[]>([]);
    const [form, setForm] = useState<VaultItem>({
        title: "",
        email: "",
        password: "",
        url: "",
        notes: "",
    });
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
        const res = await fetch("/api/vault");
        const data = await res.json();
        if (data.success) setItems(data.data);
        })();
    }, []);

    // Handle new entry
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.success) {
        alert("Item added!");
        setItems([...items, data.data]);
        setForm({ title: "", email: "", password: "", url: "", notes: "" });
        } else {
        alert("Failed to add item");
        }
    };

    const filtered = items.filter(
        (i) =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">🔐 My Vault</h1>
            <button
                onClick={() => signOut()}
                className="text-red-600 font-medium hover:underline"
            >
                Logout
            </button>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border p-2 rounded"
                required
            />
            <input
                type="text"
                placeholder="Username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-2 rounded"
                required
            />
            <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border p-2 rounded"
                required
            />
            <input
                type="text"
                placeholder="URL"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full border p-2 rounded"
            />
            <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border p-2 rounded"
            />
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Save Entry
            </button>
            </form>

            <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            />

            {filtered.length === 0 ? (
            <p className="text-gray-500 text-center">No items found.</p>
            ) : (
            <div className="space-y-3">
                {filtered.map((item) => (
                <div key={item._id} className="border p-3 rounded">
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-600">Username: {item.email}</p>
                    <p className="text-sm text-gray-600">Password: {item.password}</p>
                    {item.url && (
                    <a
                        href={item.url}
                        target="_blank"
                        className="text-blue-600 text-sm hover:underline"
                    >
                        {item.url}
                    </a>
                    )}
                    {item.notes && <p className="text-sm text-gray-500 mt-1">{item.notes}</p>}
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
}
