"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bolt, ShieldCheck, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SearchInput from "@/components/SearchInput";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/data";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const popular = categories.flatMap((c) => c.tools.map((t) => ({ t, c }))).slice(0, 6);

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
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current) return;
      if (event.target instanceof Node && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-surface pb-20 md:pb-0">
      <Header />
      <main className="pt-16">
        <section className="bg-mesh relative overflow-visible px-4 pb-20 pt-16 text-center sm:pb-24 sm:pt-20">
          <div className="relative z-10 mx-auto max-w-content">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container/30 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary">
              <Bolt size={14} />Fast. Free. Local.
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-.04em] text-white sm:text-6xl">
              Ferramentas Digitais
              <br />
              <span className="text-primary">Sem Complicação</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted sm:text-base">
              Ferramentas rápidas e seguras para o seu dia a dia. By Vuarix Tools.
            </p>
            <div ref={searchRef} className="mx-auto mt-8 max-w-xl relative">
              <SearchInput
                value={query}
                onChange={(value) => {
                  setQuery(value);
                  setIsSearchOpen(Boolean(value.trim()));
                }}
                onKeyDown={handleSearchEnter}
                placeholder="Qual ferramenta você precisa agora?"
                size="lg"
              />
              {isSearchOpen && (
                <div className="absolute inset-x-0 top-full z-40 mt-3 overflow-hidden rounded-3xl border border-border-light bg-surface-light/95 p-3 shadow-xl backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark-alt/95">
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
                          onClick={() => {
                            setQuery("");
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-surface-highest hover:text-primary"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-highest text-primary">
                            <ToolIcon name={item.icon} size={18} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground dark:text-white">{item.label}</p>
                            <p className="truncate text-xs text-muted-light dark:text-muted-dark">{item.description}</p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-success" />Processamento local
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-primary" />Sem cadastro
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Categorias</h2>
              <p className="mt-1 text-sm text-muted">Explore nossas soluções organizadas por área.</p>
            </div>
            <Link href="/categorias" className="text-sm font-medium text-primary">
              Ver todas →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-container px-4 pb-16 sm:px-6">
          <div className="mb-7">
            <h2 className="font-display text-2xl font-bold text-white">Mais procuradas</h2>
            <p className="mt-1 text-sm text-muted">Atalhos para resolver agora.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {popular.map(({ t, c }) => (
              <ToolCard key={`${c.slug}-${t.slug}`} tool={t} categorySlug={c.slug} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

