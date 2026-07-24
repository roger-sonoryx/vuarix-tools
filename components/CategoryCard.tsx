import Link from "next/link";
import ToolIcon from "./ToolIcon";
import type { Category } from "@/lib/data";
import { getCategoryAccent } from "@/lib/data";
export default function CategoryCard({category}:{category:Category}){
  const accent = getCategoryAccent(category.slug);
  return (
    <Link href={`/${category.slug}`} className="stitch-card group block p-5">
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: accent.accentSoft, color: accent.accent }}
      >
        <ToolIcon name={category.icon} size={24} />
      </div>
      <h3 className="font-display font-bold text-slate-950 dark:text-white">{category.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{category.description}</p>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-wider" style={{ color: accent.accent }}>
        {category.tools.length} ferramentas
      </div>
    </Link>
  );
}
