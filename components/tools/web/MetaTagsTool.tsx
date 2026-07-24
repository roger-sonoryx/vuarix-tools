"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";

export default function MetaTagsTool() {
  const [title, setTitle] = useState("Vuarix Tools — Ferramentas inteligentes");
  const [description, setDescription] = useState("Ferramentas online gratuitas, rápidas e sem cadastro.");
  const [author, setAuthor] = useState("Vuarix");
  const [keywords, setKeywords] = useState("ferramentas online, pdf, conversor, calculadora");
  const [robots, setRobots] = useState("index, follow");

  const output = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    author.trim() && `<meta name="author" content="${author}" />`,
    keywords.trim() && `<meta name="keywords" content="${keywords}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <ToolPanel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="meta-title" className="block text-sm font-medium mb-1.5">Título da página</label>
          <input
            id="meta-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="meta-desc" className="block text-sm font-medium mb-1.5">Descrição</label>
          <textarea
            id="meta-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition resize-y"
          />
        </div>
        <div>
          <label htmlFor="meta-author" className="block text-sm font-medium mb-1.5">Autor</label>
          <input
            id="meta-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
        <div>
          <label htmlFor="meta-robots" className="block text-sm font-medium mb-1.5">Robots</label>
          <select
            id="meta-robots"
            value={robots}
            onChange={(e) => setRobots(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          >
            <option value="index, follow">index, follow</option>
            <option value="noindex, follow">noindex, follow</option>
            <option value="index, nofollow">index, nofollow</option>
            <option value="noindex, nofollow">noindex, nofollow</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="meta-keywords" className="block text-sm font-medium mb-1.5">Palavras-chave (separadas por vírgula)</label>
          <input
            id="meta-keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm font-medium">HTML gerado</span>
          <CopyButton value={output} />
        </div>
        <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </ToolPanel>
  );
}
