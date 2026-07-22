import Link from "next/link";
import ToolIcon from "./ToolIcon";
import type { Category } from "@/lib/data";
export default function CategoryCard({category}:{category:Category}){return <Link href={`/${category.slug}`} className="stitch-card group block p-5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/50 text-primary"><ToolIcon name={category.icon} size={24}/></div><h3 className="font-display font-bold text-white">{category.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{category.description}</p><div className="mt-4 font-mono text-[10px] uppercase tracking-wider text-primary">{category.tools.length} ferramentas</div></Link>}
