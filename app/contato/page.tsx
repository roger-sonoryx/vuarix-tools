import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface pb-20 md:pb-0">
      <Header />
      <main className="pt-28">
        <section className="mx-auto max-w-container px-4 py-14 sm:px-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container/30 px-3 py-1 text-xs uppercase tracking-wider text-primary">
            <Mail size={14} /> Contato
          </div>

          <div className="rounded-3xl border border-border-light bg-surface-light/90 p-10 shadow-sm shadow-black/10 dark:border-border-dark dark:bg-surface-dark-alt/90">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl font-bold text-white">Fale com a equipe Vuarix</h1>
              <p className="mt-4 text-sm leading-7 text-muted">
                Para dúvidas, sugestões ou parcerias, envie um e-mail diretamente para{' '}
                <a href="mailto:falecom@vuarix.com" className="text-primary hover:underline">
                  falecom@vuarix.com
                </a>.
              </p>

              <div className="mt-10 rounded-3xl border border-border-light bg-surface/80 p-6 text-sm text-muted dark:bg-surface-dark/80">
                <p className="font-semibold text-white">Recomendado</p>
                <p className="mt-3">Abra seu cliente de e-mail e envie uma mensagem para:</p>
                <p className="mt-4 rounded-2xl border border-border-light bg-surface-light px-4 py-3 text-sm text-foreground dark:bg-surface-dark">
                  falecom@vuarix.com
                </p>
              </div>

              <Link
                href="mailto:falecom@vuarix.com"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Enviar e-mail
              </Link>

              <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-white">
                <ArrowLeft size={16} /> Voltar para início
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
