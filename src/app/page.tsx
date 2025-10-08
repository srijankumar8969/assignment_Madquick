"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, KeyRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-black via-gray-950 to-black text-gray-100"
          : "bg-gradient-to-br from-white via-gray-50 to-white text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h1
          className={`text-5xl md:text-6xl font-extrabold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to{" "}
          <span className="text-green-500 font-extrabold">SecureVault</span>
        </h1>
        <p
          className={`text-lg md:text-xl max-w-2xl mx-auto ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Manage and protect your passwords with simplicity and power.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Generator Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`rounded-2xl border p-8 shadow-[0_0_20px_rgba(0,255,0,0.15)] transition-all ${
            isDark
              ? "bg-black border-gray-800 hover:border-green-500"
              : "bg-white border-gray-200 hover:border-green-500"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-green-500/10 p-4 rounded-full">
              <KeyRound className="text-green-500 w-10 h-10" />
            </div>
            <h2
              className={`text-2xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Password Generator
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Create secure, random passwords instantly. Choose your length and
              strength.
            </p>
            <Link
              href="/passwordgenerator"
              className="mt-4 inline-block px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition text-white font-medium"
            >
              Generate Now
            </Link>
          </div>
        </motion.div>

        {/* Vault Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`rounded-2xl border p-8 shadow-[0_0_20px_rgba(0,255,0,0.15)] transition-all ${
            isDark
              ? "bg-black border-gray-800 hover:border-green-500"
              : "bg-white border-gray-200 hover:border-green-500"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-green-500/10 p-4 rounded-full">
              <Shield className="text-green-500 w-10 h-10" />
            </div>
            <h2
              className={`text-2xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Password Vault
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Store and manage your saved passwords securely with encryption.
            </p>
            <Link
              href="/passwordvault"
              className="mt-4 inline-block px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition text-white font-medium"
            >
              Go to Vault
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer
        className={`mt-16 text-sm ${
          isDark ? "text-gray-600" : "text-gray-500"
        }`}
      >
        © {new Date().getFullYear()}{" "}
        <span className="text-green-500 font-semibold">SecureVault</span>
      </footer>
    </main>
  );
}
