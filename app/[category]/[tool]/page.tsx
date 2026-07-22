import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import FAQAccordion from "@/components/FAQAccordion";
import ToolInterface from "@/components/tools/ToolInterface";
import { getAllToolPaths, getTool } from "@/lib/data";

type ToolPageProps = {
  params: Promise<{
    category: string;
    tool: string;
  }>;
};

export function generateStaticParams() {
  return getAllToolPaths();
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { category, tool } = await params;
  const result = getTool(category, tool);

  if (!result) {
    return {};
  }

  return {
    title: result.tool.name,
    description: result.tool.description,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { category: categorySlug, tool: toolSlug } = await params;
  const result = getTool(categorySlug, toolSlug);

  if (!result) {
    notFound();
  }

  const { tool, category } = result;

  const related = category.tools
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-surface pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-content px-4 pb-16 pt-24 sm:px-6">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            {
              label: category.name,
              href: `/${category.slug}`,
            },
            { label: tool.name },
          ]}
        />

        <header className="mb-8 mt-7 text-center">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-primary shadow-glow">
            <ToolIcon name={tool.icon} size={31} />
          </span>

          <h1 className="font-display text-3xl font-bold text-white">
            {tool.name}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            {tool.description}. Processado com privacidade e velocidade.
          </p>
        </header>

        <ToolInterface slug={tool.slug} />

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="stitch-card flex gap-3 p-5">
            <ShieldIcon />

            <div>
              <h3 className="text-sm font-semibold">100% seguro</h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                Seus dados permanecem no navegador sempre que possível.
              </p>
            </div>
          </div>

          <div className="stitch-card flex gap-3 p-5">
            <BoltIcon />

            <div>
              <h3 className="text-sm font-semibold">Rápido e gratuito</h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                Sem cadastro, filas ou etapas desnecessárias.
              </p>
            </div>
          </div>
        </section>

        {category.faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold">
              Perguntas frequentes
            </h2>

            <FAQAccordion faqs={category.faqs} />
          </section>
        )}

        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">
            Ferramentas relacionadas
          </h2>

          <div className="grid gap-3">
            {related.map((relatedTool) => (
              <ToolCard
                key={relatedTool.slug}
                tool={relatedTool}
                categorySlug={category.slug}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function ShieldIcon() {
  return (
    <span className="material-symbols-outlined text-success">
      verified_user
    </span>
  );
}

function BoltIcon() {
  return (
    <span className="material-symbols-outlined text-primary">
      bolt
    </span>
  );
}