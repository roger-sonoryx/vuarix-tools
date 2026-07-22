"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

// Usado na página de Categoria e na página de Ferramenta.
export default function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);

  if (faqs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
          >
            <span className="font-medium text-sm sm:text-[15px]">{f.q}</span>
            {open === i ? (
              <Minus size={15} className="text-action shrink-0" />
            ) : (
              <Plus size={15} className="text-muted-light dark:text-muted-dark shrink-0" />
            )}
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm leading-relaxed text-muted-light dark:text-muted-dark">
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
