import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

// Usado na página de Categoria e na página de Ferramenta.
// Passe os itens do caminho; o último item fica em destaque e sem link.
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm pt-6 flex-wrap text-muted-light dark:text-muted-dark">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:opacity-70">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-ink dark:text-white" : ""}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={13} />}
          </span>
        );
      })}
    </nav>
  );
}
