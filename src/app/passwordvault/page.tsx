"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2, Copy, Plus } from "lucide-react";

interface VaultItem {
    _id: string;
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
}

export default function VaultPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [items, setItems] = useState<VaultItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

    const [form, setForm] = useState({
        title: "",
        username: "",
        password: "",
        url: "",
        notes: "",
    });
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);

    // Fetch vault items
    useEffect(() => {
        if (status === "authenticated") {
            fetchItems();
        }
    }, [status]);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/vault");
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/signin" });
    };

    // Handle new entry
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/vault", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                setItems([data.data, ...items]);
                setForm({ title: "", username: "", password: "", url: "", notes: "" });
                setShowForm(false);
                alert("Item added successfully!");
            } else {
                alert(data.message || "Failed to add item");
            }
        } catch (error) {
            console.error("Failed to add item:", error);
            alert("Failed to add item");
        }
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/vault?id=${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setItems(items.filter((item) => item._id !== id));
                alert("Item deleted successfully!");
            } else {
                alert(data.message || "Failed to delete item");
            }
        } catch (error) {
            console.error("Failed to delete item:", error);
            alert("Failed to delete item");
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (id: string) => {
        setVisiblePasswords((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Copy to clipboard
    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert(`${label} copied to clipboard!`);
        } catch (error) {
            console.error("Failed to copy:", error);
            alert("Failed to copy");
        }
    };

    // Filter items
    const filtered = items.filter(
        (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
    );

    // Loading state
    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <p className="text-center text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                🔐 Password Vault
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Logged in as: {session?.user?.email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Add New Item Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        {showForm ? "Cancel" : "Add New Password"}
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Add New Entry
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Gmail Account"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username/Email *
                                </label>
                                <input
                                    type="text"
                                    placeholder="username@example.com"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={form.url}
                                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    placeholder="Additional notes..."
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Save Entry
                            </button>
                        </form>
                    </div>
                )}

                {/* Search */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by title or username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border-0 p-2 text-gray-900 focus:outline-none"
                    />
                </div>

                {/* Items List */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <p className="text-gray-500 text-lg">
                                {search ? "No items found" : "No passwords saved yet"}
                            </p>
                            {!search && !showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Add your first password →
                                </button>
                            )}
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Title</p>
                                            <p className="text-gray-900 font-mono">{item.title}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Username</p>
                                            <p className="text-gray-900 font-mono">{item.username}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(item.username, "Username")}
                                            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                            title="Copy username"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Password</p>
                                            <p className="text-gray-900 font-mono">
                                                {visiblePasswords.has(item._id)
                                                    ? item.password
                                                    : "••••••••••••"}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => togglePasswordVisibility(item._id)}
                                                className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                                title={
                                                    visiblePasswords.has(item._id)
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {visiblePasswords.has(item._id) ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(item.password, "Password")}
                                                className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                                title="Copy password"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {item.url && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Website</p>
                                            <a href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all">
                                                
                                            
                                                {item.url}
                                            </a>
                                        </div>
                                    )}

                                    {item.notes && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Notes</p>
                                            <p className="text-gray-900 text-sm">{item.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}