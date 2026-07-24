"use client";

import { Search } from "lucide-react";

// Campo de busca reutilizado no Header, na Home (hero) e nas páginas de Categoria.
// O componente é "controlado" opcionalmente: se não receber value/onChange,
// funciona como um input livre (ex: dentro do Header).
export default function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
  onKeyDown,
  size = "md",
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  size?: "md" | "lg";
}) {
  const isLarge = size === "lg";

  return (
    <div className="relative w-full">
      <Search
        size={isLarge ? 20 : 16}
        className={`absolute top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark ${
          isLarge ? "left-5" : "left-3"
        }`}
      />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark outline-none transition focus:border-action ${
          isLarge
            ? "pl-14 pr-4 py-4 sm:py-5 text-base sm:text-lg rounded-2xl border-2 shadow-sm"
            : "pl-9 pr-3 py-2 text-sm"
        }`}
      />
    </div>
  );
}
