"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function SigninPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      alert(res.error);
    } else if (res?.ok) {
      alert("Login successful!");
      router.push("/passwordvault");
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-black via-gray-950 to-black text-gray-900"
          : "bg-gradient-to-br from-white via-gray-50 to-white text-gray-100"
      }`}
    >
      <div
        className={`shadow-lg rounded-2xl p-8 w-full max-w-sm transition-colors duration-500 ${
          isDark
            ? "bg-white text-gray-900"
            : "bg-black text-gray-100"
        }`}
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-green-500 font-medium hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </main>
  );
}
