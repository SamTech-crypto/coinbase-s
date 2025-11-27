'use client';

import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-xl backdrop-blur-md bg-white/20 hover:bg-white/30 transition"
    >
      {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
    </button>
  );
}
