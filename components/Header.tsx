"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Moon } from "lucide-react";
import { useState } from "react";
import SearchInput from "./SearchInput";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-dark bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-fit items-center gap-2" aria-label="Vuarix Tools — início">
          <Image
            src="/brand/vuarix-logo-blue.png"
            alt="Vuarix"
            width={116}
            height={62}
            className="h-[31px] w-auto object-contain"
            priority
          />
          <span className="border-l border-border-dark pl-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Tools
          </span>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="w-full max-w-md">
            <SearchInput placeholder="Buscar ferramentas..." />
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted">
          <Link href="/categorias" aria-label="Buscar" className="md:hidden">
            <Search size={20} />
          </Link>
          <button aria-label="Tema escuro">
            <Moon size={20} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
            className="rounded-lg bg-surface-highest p-2 text-primary"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border-dark bg-surface px-4 py-3">
          <nav className="mx-auto flex max-w-container gap-5 text-sm text-muted">
            <Link href="/categorias">Categorias</Link>
            <Link href="/privacidade">Privacidade</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
