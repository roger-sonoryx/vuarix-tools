import { Mail } from "lucide-react";

export default function ContactForm() {
  return (
    <section className="mx-auto max-w-container px-4 py-14 sm:px-6">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container/30 px-3 py-1 text-xs uppercase tracking-wider text-primary">
          <Mail size={14} /> Contato
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">Fale conosco</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Para falar com a equipe, envie um e-mail para <span className="text-primary">falecom@vuarix.com</span>.
        </p>
      </div>

      <div className="stitch-card p-6 shadow-sm shadow-black/10">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-center">
          <div>
            <p className="text-sm text-muted">Clique no botão abaixo para abrir o seu cliente de e-mail e enviar sua mensagem.</p>
            <p className="mt-3 text-sm text-muted">Não é necessário preencher nada diretamente no site.</p>
          </div>
          <a
            href="mailto:falecom@vuarix.com"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Enviar e-mail
          </a>
        </div>
      </div>
    </section>
  );
}
