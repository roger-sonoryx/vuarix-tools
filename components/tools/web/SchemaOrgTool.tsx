"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";

type SchemaType = "Organization" | "Article" | "Product" | "FAQPage";

type FaqItem = { q: string; a: string };

export default function SchemaOrgTool() {
  const [type, setType] = useState<SchemaType>("Organization");
  const [orgName, setOrgName] = useState("Vuarix");
  const [orgUrl, setOrgUrl] = useState("https://vuarix.com");
  const [orgLogo, setOrgLogo] = useState("https://vuarix.com/logo.png");
  const [articleTitle, setArticleTitle] = useState("Como comprimir um PDF gratuitamente");
  const [articleAuthor, setArticleAuthor] = useState("Vuarix");
  const [articleDate, setArticleDate] = useState(new Date().toISOString().split("T")[0]);
  const [articleImage, setArticleImage] = useState("https://vuarix.com/artigo.jpg");
  const [productName, setProductName] = useState("Ferramenta Vuarix");
  const [productPrice, setProductPrice] = useState("0");
  const [productCurrency, setProductCurrency] = useState("BRL");
  const [faqItems, setFaqItems] = useState<FaqItem[]>([{ q: "Isso é gratuito?", a: "Sim, todas as ferramentas são gratuitas." }]);

  const buildJson = (): object => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: orgName,
          url: orgUrl,
          logo: orgLogo,
        };
      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: articleTitle,
          author: { "@type": "Person", name: articleAuthor },
          datePublished: articleDate,
          image: articleImage,
        };
      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: productName,
          offers: {
            "@type": "Offer",
            price: productPrice,
            priceCurrency: productCurrency,
          },
        };
      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems
            .filter((f) => f.q.trim())
            .map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        };
    }
  };

  const output = `<script type="application/ld+json">\n${JSON.stringify(buildJson(), null, 2)}\n</script>`;

  return (
    <ToolPanel>
      <label className="block text-sm font-medium mb-2">Tipo de dado estruturado</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["Organization", "Article", "Product", "FAQPage"] as SchemaType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
              type === t ? "bg-action text-white border-action" : "border-border-light dark:border-border-dark hover:opacity-70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {type === "Organization" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Nome da empresa"
            className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
          <input
            value={orgUrl}
            onChange={(e) => setOrgUrl(e.target.value)}
            placeholder="URL"
            className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
          <input
            value={orgLogo}
            onChange={(e) => setOrgLogo(e.target.value)}
            placeholder="URL do logo"
            className="sm:col-span-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
      )}

      {type === "Article" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            placeholder="Título"
            className="sm:col-span-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
          <input
            value={articleAuthor}
            onChange={(e) => setArticleAuthor(e.target.value)}
            placeholder="Autor"
            className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
          <input
            type="date"
            value={articleDate}
            onChange={(e) => setArticleDate(e.target.value)}
            className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
          <input
            value={articleImage}
            onChange={(e) => setArticleImage(e.target.value)}
            placeholder="URL da imagem"
            className="sm:col-span-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
      )}

      {type === "Product" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nome do produto"
            className="sm:col-span-3 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
          <input
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Preço"
            className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
          <input
            value={productCurrency}
            onChange={(e) => setProductCurrency(e.target.value)}
            placeholder="Moeda (BRL, USD...)"
            className="sm:col-span-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
      )}

      {type === "FAQPage" && (
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-border-light dark:border-border-dark p-3">
              <input
                value={item.q}
                onChange={(e) => setFaqItems((prev) => prev.map((f, idx) => (idx === i ? { ...f, q: e.target.value } : f)))}
                placeholder="Pergunta"
                className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none focus:border-action transition"
              />
              <textarea
                value={item.a}
                onChange={(e) => setFaqItems((prev) => prev.map((f, idx) => (idx === i ? { ...f, a: e.target.value } : f)))}
                placeholder="Resposta"
                rows={2}
                className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none focus:border-action transition resize-y"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFaqItems((prev) => [...prev, { q: "", a: "" }])}
            className="text-sm font-medium px-3 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition"
          >
            + Adicionar pergunta
          </button>
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm font-medium">JSON-LD gerado</span>
          <CopyButton value={output} />
        </div>
        <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto max-h-72 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </ToolPanel>
  );
}
