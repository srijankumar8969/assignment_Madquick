"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2, Copy, Plus, Edit2, X } from "lucide-react";
import { useTheme } from "next-themes";

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
    const { theme } = useTheme();

    // ALL hooks declared first, unconditionally
    const [mounted, setMounted] = useState(false);
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
    const [editingId, setEditingId] = useState<string | null>(null);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);

    const isDark = theme === "dark";

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

  // ...rest of your code (fetchItems, handleLogout, handleSubmit, etc.) ...


    const fetchItems = async () => {
        try {
        const res = await fetch("/api/vault");
        const data = await res.json();
        if (data.success) setItems(data.data);
        } catch (error) {
        console.error("Failed to fetch items:", error);
        } finally {
        setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/signin" });
    };

    const resetForm = () => {
        setForm({ title: "", username: "", password: "", url: "", notes: "" });
        setShowForm(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const method = editingId ? "PUT" : "POST";
        const body = editingId ? { id: editingId, ...form } : form;

        const res = await fetch("/api/vault", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.success) {
            if (editingId) {
            setItems(items.map(item => (item._id === editingId ? data.data : item)));
            alert("Item updated successfully!");
            } else {
            setItems([data.data, ...items]);
            alert("Item added successfully!");
            }
            resetForm();
        } else {
            alert(data.message || "Failed to save item");
        }
        } catch (error) {
        console.error("Failed to save item:", error);
        alert("Failed to save item");
        }
    };

    const handleEdit = (item: VaultItem) => {
        setForm({
        title: item.title,
        username: item.username,
        password: item.password,
        url: item.url || "",
        notes: item.notes || "",
        });
        setEditingId(item._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
        const res = await fetch(`/api/vault?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
            setItems(items.filter(item => item._id !== id));
            alert("Item deleted successfully!");
        } else {
            alert(data.message || "Failed to delete item");
        }
        } catch (error) {
        console.error("Failed to delete item:", error);
        alert("Failed to delete item");
        }
    };

    const togglePasswordVisibility = (id: string) => {
        setVisiblePasswords(prev => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
        });
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
        await navigator.clipboard.writeText(text);
        alert(`${label} copied to clipboard!`);
        } catch (error) {
        console.error("Failed to copy:", error);
        alert("Failed to copy");
        }
    };

    const filtered = items.filter(
        item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase())
    );

    if (status === "loading" || isLoading) {
        return (
        <div
            className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
            isDark
                ? "bg-black text-green-400"
                : "bg-white text-green-600"
            }`}
        >
            <p className="text-xl animate-pulse">Loading your vault...</p>
        </div>
        );
    }

    if (status === "unauthenticated") return null;

    return (
        <div
        className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${
            isDark
            ? "bg-gradient-to-br from-black via-gray-950 to-black text-green-400"
            : "bg-gradient-to-br from-white via-gray-50 to-white text-green-600"
        }`}
        >
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div
            className={`rounded-xl shadow-lg p-6 mb-6 transition-colors duration-500 ${
                isDark ? "bg-black text-gray-100" : "bg-white text-gray-900"
            }`}
            >
            <div className="flex justify-between items-center">
                <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    🔐 Password Vault
                </h1>
                <p className="text-sm mt-1">
                    Logged in as: {session?.user?.email}
                </p>
                </div>
                
            </div>
            </div>

            {/* Add New Item Button */}
            <div className="mb-6">
            <button
                onClick={() => (showForm ? resetForm() : setShowForm(true))}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
                {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {showForm ? "Cancel" : "Add New Password"}
            </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
            <div
                className={`rounded-xl shadow-lg p-6 mb-6 transition-colors duration-500 ${
                isDark ? "bg-black text-gray-100" : "bg-white text-gray-900"
                }`}
            >
                <h2 className="text-xl font-semibold mb-4">
                {editingId ? "Edit Entry" : "Add New Entry"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                {/* same input fields, just remove fixed bg-white / text-gray-900 */}
                {["title", "username", "password", "url", "notes"].map((field, i) => (
                    <div key={i}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                        {field === "username" ? "Username/Email" : field}
                    </label>
                    {field !== "notes" ? (
                        <input
                        type={field === "password" ? "password" : "text"}
                        placeholder={`Enter ${field}`}
                        value={(form as any)[field]}
                        onChange={e => setForm({ ...form, [field]: e.target.value })}
                        required={field !== "url" && field !== "notes"}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                        />
                    ) : (
                        <textarea
                        placeholder="Additional notes..."
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                        />
                    )}
                    </div>
                ))}
                <div className="flex gap-3">
                    <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                    {editingId ? "Update Entry" : "Save Entry"}
                    </button>
                    {editingId && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    )}
                </div>
                </form>
            </div>
            )}

            {/* Search & Items List */}
            <div
            className={`rounded-xl shadow-lg p-4 mb-6 transition-colors duration-500 ${
                isDark ? "bg-black text-gray-100" : "bg-white text-gray-900"
            }`}
            >
            <input
                type="text"
                placeholder="Search by title or username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border-0 p-2 bg-transparent focus:outline-none"
            />
            </div>

            <div className="space-y-4">
            {filtered.length === 0 ? (
                <div
                className={`rounded-xl shadow-lg p-12 text-center transition-colors duration-500 ${
                    isDark ? "bg-black text-gray-400" : "bg-white text-gray-500"
                }`}
                >
                <p className="text-lg">
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
                filtered.map(item => (
                <div
                    key={item._id}
                    className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow transition-colors duration-500 ${
                    isDark ? "bg-black text-gray-100" : "bg-white text-gray-900"
                    }`}
                >
                    {/* same content, no changes */}
                    <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Title</p>
                        <p className="font-mono">{item.title}</p>
                        </div>
                        <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Username</p>
                        <p className="font-mono">{item.username}</p>
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
                        <p className="font-mono">
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
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                        >
                            {item.url}
                        </a>
                        </div>
                    )}

                    {item.notes && (
                        <div>
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm">{item.notes}</p>
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
