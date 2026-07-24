"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";

export default function OpenGraphTool() {
  const [title, setTitle] = useState("Vuarix Tools — Ferramentas inteligentes");
  const [description, setDescription] = useState("Ferramentas online gratuitas, rápidas e sem cadastro.");
  const [url, setUrl] = useState("https://vuarix.com");
  const [image, setImage] = useState("https://vuarix.com/og-image.png");
  const [type, setType] = useState("website");
  const [siteName, setSiteName] = useState("Vuarix");
  const [locale, setLocale] = useState("pt_BR");

  const output = [
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:locale" content="${locale}" />`,
  ].join("\n");

  return (
    <ToolPanel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="og-title" className="block text-sm font-medium mb-1.5">Título Open Graph</label>
          <input
            id="og-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="og-description" className="block text-sm font-medium mb-1.5">Descrição</label>
          <textarea
            id="og-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition resize-y"
          />
        </div>
        <div>
          <label htmlFor="og-url" className="block text-sm font-medium mb-1.5">URL</label>
          <input
            id="og-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
        <div>
          <label htmlFor="og-image" className="block text-sm font-medium mb-1.5">Imagem</label>
          <input
            id="og-image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
        <div>
          <label htmlFor="og-type" className="block text-sm font-medium mb-1.5">Tipo</label>
          <select
            id="og-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          >
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
            <option value="profile">profile</option>
          </select>
        </div>
        <div>
          <label htmlFor="og-site-name" className="block text-sm font-medium mb-1.5">Site name</label>
          <input
            id="og-site-name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
        <div>
          <label htmlFor="og-locale" className="block text-sm font-medium mb-1.5">Locale</label>
          <input
            id="og-locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm font-medium">Meta tags Open Graph</span>
          <CopyButton value={output} />
        </div>
        <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </ToolPanel>
  );
}
