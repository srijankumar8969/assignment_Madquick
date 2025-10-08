"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { useTheme } from "next-themes";

type StrengthType = "Weak" | "Medium" | "Strong" | "";

export default function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
    });
    const [copied, setCopied] = useState(false);
    const [strength, setStrength] = useState<StrengthType>("");
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark = theme === "dark";

    const charSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    const similarChars = "il1Lo0O";

    const generatePassword = () => {
        let charset = "";
        let generated = "";

        if (options.uppercase) charset += charSets.uppercase;
        if (options.lowercase) charset += charSets.lowercase;
        if (options.numbers) charset += charSets.numbers;
        if (options.symbols) charset += charSets.symbols;

        if (options.excludeSimilar) {
        charset = charset
            .split("")
            .filter((char) => !similarChars.includes(char))
            .join("");
        }

        if (charset === "") {
        alert("Please select at least one character type!");
        return;
        }

        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        generated += charset[randomIndex];
        }

        setPassword(generated);
        calculateStrength(generated);
        setCopied(false);
    };

    const calculateStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 12) score++;
        if (pwd.length >= 16) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;

        if (score <= 2) setStrength("Weak");
        else if (score <= 4) setStrength("Medium");
        else setStrength("Strong");
    };

    const copyToClipboard = async () => {
        if (!password) {
        alert("Generate a password first!");
        return;
        }

        try {
        await navigator.clipboard.writeText(password);
        setCopied(true);

        setTimeout(async () => {
            await navigator.clipboard.writeText("");
            console.log("Clipboard cleared after 15 seconds");
        }, 15000);

        setTimeout(() => setCopied(false), 2000);
        } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy password");
        }
    };

    const toggleOption = (key: keyof typeof options) => {
        setOptions({ ...options, [key]: !options[key] });
    };

    const getStrengthColor = () => {
        if (strength === "Weak") return "bg-red-500";
        if (strength === "Medium") return "bg-yellow-500";
        if (strength === "Strong") return "bg-green-500";
        return "bg-gray-300";
    };

    const getStrengthWidth = () => {
        if (strength === "Weak") return "33%";
        if (strength === "Medium") return "66%";
        if (strength === "Strong") return "100%";
        return "0%";
    };

    const getStrengthTextColor = () => {
        if (strength === "Weak") return "text-red-500";
        if (strength === "Medium") return "text-yellow-500";
        if (strength === "Strong") return "text-green-500";
        return isDark ? "text-gray-400" : "text-gray-600";
    };

    return (
        <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
            isDark
            ? "bg-gradient-to-br from-black via-gray-950 to-black text-gray-100"
            : "bg-gradient-to-br from-white via-gray-50 to-white text-gray-900"
        }`}
        >
        <div
            className={`rounded-2xl shadow-2xl p-8 w-full max-w-md border transition-all ${
            isDark
                ? "bg-black border-gray-800 text-green-400"
                : "bg-white border-gray-200 text-green-600"
            }`}
        >
            <h1
            className={`text-3xl font-bold mb-2 text-center ${
                isDark ? "text-white" : "text-gray-900"
            }`}
            >
            Password Generator
            </h1>
            <p
            className={`text-center mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
            }`}
            >
            Create secure passwords instantly
            </p>

            <div
            className={`rounded-lg p-4 mb-6 border-2 transition-all ${
                isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
            }`}
            >
            <div className="flex items-center justify-between mb-2">
                <input
                type="text"
                value={password}
                readOnly
                placeholder="Click Generate to create password"
                className={`bg-transparent text-lg font-mono flex-1 outline-none ${
                    isDark ? "text-gray-100" : "text-gray-800"
                }`}
                />
                <button
                onClick={copyToClipboard}
                className={`ml-2 p-2 rounded-lg transition-colors ${
                    isDark
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
                title="Copy to clipboard"
                >
                {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                ) : (
                    <Copy className="w-5 h-5" />
                )}
                </button>
            </div>

            {password && (
                <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Strength:</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: getStrengthWidth() }}
                    ></div>
                </div>
                <span
                    className={`text-xs font-semibold ${getStrengthTextColor()}`}
                >
                    {strength}
                </span>
                </div>
            )}
            </div>

            {/* Password Length Slider */}
            <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <label
                className={`text-sm font-semibold ${
                    isDark ? "text-gray-300" : "text-gray-700"
                }`}
                >
                Password Length
                </label>
                <span className="text-lg font-bold text-green-500">{length}</span>
            </div>
            <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div
                className={`flex justify-between text-xs mt-1 ${
                isDark ? "text-gray-500" : "text-gray-400"
                }`}
            >
                <span>8</span>
                <span>32</span>
            </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 mb-6">
            {Object.entries({
                uppercase: "Uppercase Letters (A-Z)",
                lowercase: "Lowercase Letters (a-z)",
                numbers: "Numbers (0-9)",
                symbols: "Symbols (!@#$%^&*)",
                excludeSimilar: "Exclude Similar Characters (i, l, 1, L, o, 0, O)",
            }).map(([key, label]) => (
                <label
                key={key}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isDark
                    ? "bg-gray-900 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                >
                <span
                    className={`text-sm font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                >
                    {label}
                </span>
                <input
                    type="checkbox"
                    checked={options[key as keyof typeof options]}
                    onChange={() => toggleOption(key as keyof typeof options)}
                    className="w-5 h-5 accent-green-500 rounded focus:ring-2 focus:ring-green-500"
                />
                </label>
            ))}
            </div>

            <button
            onClick={generatePassword}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-green-500/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
            <RefreshCw className="w-5 h-5" />
            Generate Password
            </button>

            {copied && (
            <p className="text-center text-green-500 text-sm mt-4 font-medium">
                ✓ Password copied! Clipboard will clear in 15 seconds
            </p>
            )}
        </div>
        </div>
    );
}
