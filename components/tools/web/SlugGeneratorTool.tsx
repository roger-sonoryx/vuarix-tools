"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const slug = useMemo(() => slugify(input), [input]);

  return (
    <ToolPanel>
      <label htmlFor="slug-input" className="block text-sm font-medium mb-2">
        Título ou texto original
      </label>
      <input
        id="slug-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Como Unir Arquivos PDF Grátis"
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm outline-none focus:border-action transition"
      />

      {slug && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Slug gerado</div>
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm font-mono break-all select-all">
            {slug}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <CopyButton value={slug} />
        <ResetButton onClick={() => setInput("")} />
      </div>
    </ToolPanel>
  );
}
