"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import SearchInput from "./SearchInput";
import ToolIcon from "./ToolIcon";
import { categories } from "@/lib/data";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return categories
      .flatMap((category) => [
        {
          type: "category",
          label: category.name,
          description: category.description,
          href: `/${category.slug}`,
          icon: category.icon,
        },
        ...category.tools.map((tool) => ({
          type: "tool",
          label: tool.name,
          description: tool.description,
          href: `/${category.slug}/${tool.slug}`,
          icon: tool.icon,
        })),
      ])
      .filter(
        (item) =>
          item.label.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
  }, [query]);

  const handleSearchEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && results.length > 0) {
      router.push(results[0].href);
      setQuery("");
    }
  };

  const hideSearchOnHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-dark bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-fit items-center gap-2" aria-label="Vuarix Tools — início">
          <Image
            src="/brand/vuarix-logo-blue.png"
            alt="Vuarix"
            width={isHome ? 152 : 116}
            height={isHome ? 82 : 62}
            className={isHome ? "h-[40px] w-auto object-contain" : "h-[31px] w-auto object-contain"}
            priority
          />
          <span className="border-l border-border-dark pl-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Tools
          </span>
        </Link>

        {!hideSearchOnHome && (
          <div className="relative hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-md">
              <SearchInput
                value={query}
                onChange={setQuery}
                onKeyDown={handleSearchEnter}
                placeholder="Buscar ferramentas..."
              />
              {query.trim() && (
                <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-3xl border border-border-light bg-surface-light/95 p-3 shadow-xl backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark-alt/95">
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {results.length === 0 ? (
                      <div className="rounded-2xl border border-border-light/70 bg-surface/80 p-3 text-sm text-muted-dark dark:border-border-dark dark:bg-surface-dark text-muted-light">
                        Nenhum resultado encontrado.
                      </div>
                    ) : (
                      results.slice(0, 6).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setQuery("")}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-surface-highest hover:text-primary"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-highest text-primary">
                            <ToolIcon name={item.icon} size={18} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground dark:text-white">
                              {item.label}
                            </p>
                            <p className="truncate text-xs text-muted-light dark:text-muted-dark">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-muted">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu de categorias"
            aria-expanded={open}
            aria-controls="categories-menu"
            className="rounded-lg bg-surface-highest p-2 text-primary"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div
        id="categories-menu"
        className={`border-t border-border-dark bg-surface px-4 overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-[34rem] py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-container">
          <div className="grid gap-3 sm:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-border-light dark:border-border-dark bg-surface-light/90 dark:bg-surface-dark-alt px-4 py-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-surface-highest hover:text-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-highest text-primary transition group-hover:bg-primary group-hover:text-white">
                  <ToolIcon name={category.icon} size={18} />
                </span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
