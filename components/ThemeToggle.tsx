"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Alternar tema"
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
