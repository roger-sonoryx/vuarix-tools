import Image from "next/image";
import Link from "next/link";
import { Globe2, ShieldCheck, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border-dark bg-surface-lowest px-4 py-12">
      <div className="mx-auto grid max-w-container gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Image
              src="/brand/vuarix-logo-white.png"
              alt="Vuarix"
              width={172}
              height={92}
              className="h-[46px] w-auto object-contain"
            />
            <div className="border-l border-border-dark pl-3 font-mono text-[10px] uppercase tracking-[.22em] text-muted">
              Utility Engine
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Sua caixa de ferramentas digitais completa, rápida e segura. Processamento local sempre que possível.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Produto</h3>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <Link href="/categorias">Ferramentas</Link>
            <span>Novidades</span>
            <span>API</span>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Legal</h3>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <Link href="/privacidade">Privacidade</Link>
            <span>Termos</span>
            <span>Segurança</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-container items-center justify-between border-t border-border-dark pt-6 text-xs text-muted">
        <span>© 2026 Vuarix Tools</span>
        <div className="flex items-center gap-4">
          <Globe2 size={17} />
          <ShieldCheck size={17} />
          <Terminal size={17} />
          <Link href="/contato" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover">
            Fale com a Vuarix
          </Link>
        </div>
      </div>
    </footer>
  );
}
