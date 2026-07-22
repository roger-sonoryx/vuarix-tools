import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import FAQAccordion from "@/components/FAQAccordion";
import { categories, getCategory } from "@/lib/data";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const currentCategory = getCategory(category);

  if (!currentCategory) {
    return {};
  }

  return {
    title: `Ferramentas de ${currentCategory.name}`,
    description: currentCategory.description,
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;
  const currentCategory = getCategory(category);

  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-container px-4 pb-20 pt-24 sm:px-6">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: currentCategory.name },
          ]}
        />

        <header className="mb-10 mt-7">
          <div className="mb-4 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-primary">
              <ToolIcon name={currentCategory.icon} size={30} />
            </span>

            <h1 className="font-display text-3xl font-bold text-white">
              Ferramentas de {currentCategory.name}
            </h1>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted">
            {currentCategory.description}
          </p>
        </header>

        <div className="grid gap-3 md:grid-cols-2">
          {currentCategory.tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              categorySlug={currentCategory.slug}
            />
          ))}
        </div>

        {currentCategory.faqs.length > 0 && (
          <section className="mx-auto mt-16 max-w-content">
            <h2 className="mb-6 font-display text-2xl font-bold">
              Perguntas frequentes
            </h2>

            <FAQAccordion faqs={currentCategory.faqs} />
          </section>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}