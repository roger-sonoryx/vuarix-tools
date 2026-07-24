"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";

type UrlEntry = { loc: string; changefreq: string; priority: string };

const CHANGEFREQ = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

function buildSitemap(urls: UrlEntry[]): string {
  const today = new Date().toISOString().split("T")[0];
  const items = urls
    .filter((u) => u.loc.trim())
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${escapeXml(u.loc.trim())}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function SitemapXmlTool() {
  const [urls, setUrls] = useState<UrlEntry[]>([{ loc: "https://vuarix.com/", changefreq: "weekly", priority: "1.0" }]);

  const update = (i: number, patch: Partial<UrlEntry>) => {
    setUrls((prev) => prev.map((u, idx) => (idx === i ? { ...u, ...patch } : u)));
  };

  const addRow = () => setUrls((prev) => [...prev, { loc: "", changefreq: "monthly", priority: "0.5" }]);
  const removeRow = (i: number) => setUrls((prev) => prev.filter((_, idx) => idx !== i));
  const clear = () => setUrls([{ loc: "", changefreq: "weekly", priority: "0.5" }]);

  const xml = buildSitemap(urls);

  return (
    <ToolPanel>
      <div className="space-y-2">
        {urls.map((u, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <input
              value={u.loc}
              onChange={(e) => update(i, { loc: e.target.value })}
              placeholder="https://seusite.com/pagina"
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none focus:border-action transition"
            />
            <select
              value={u.changefreq}
              onChange={(e) => update(i, { changefreq: e.target.value })}
              className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-2 py-2 text-sm outline-none"
            >
              {CHANGEFREQ.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <input
              value={u.priority}
              onChange={(e) => update(i, { priority: e.target.value })}
              className="w-16 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-2 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              disabled={urls.length === 1}
              aria-label="Remover"
              className="px-2 text-sm opacity-60 hover:opacity-100 disabled:opacity-20 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={addRow}
          className="text-sm font-medium px-3 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition"
        >
          + Adicionar URL
        </button>
        <ResetButton onClick={clear} />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-sm font-medium">sitemap.xml</span>
          <div className="flex gap-2">
            <CopyButton value={xml} />
            <DownloadButton data={xml} filename="sitemap.xml" mimeType="application/xml" label="Baixar" />
          </div>
        </div>
        <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto max-h-72">
          {xml}
        </pre>
      </div>
    </ToolPanel>
  );
}
