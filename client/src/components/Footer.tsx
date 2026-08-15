import { Phone, Heart, Shield, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-sidebar text-sidebar-foreground py-6" role="contentinfo" aria-label="Contatos de emergência e créditos">
      <div className="container">
        <nav aria-label="Contatos de emergência" className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm font-body font-semibold">
          <a href="tel:188" className="flex items-center gap-1.5 hover:text-secondary transition-colors" aria-label="Ligar para o CVV, Centro de Valorização da Vida, telefone 188">
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>CVV: 188</span>
          </a>
          <span className="hidden sm:inline text-sidebar-foreground/40" aria-hidden="true">·</span>
          <a href="tel:136" className="flex items-center gap-1.5 hover:text-accent transition-colors" aria-label="Ligar para o SUS, telefone 136">
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span>SUS: 136</span>
          </a>
          <span className="hidden sm:inline text-sidebar-foreground/40" aria-hidden="true">·</span>
          <a href="tel:192" className="flex items-center gap-1.5 hover:text-destructive transition-colors" aria-label="Ligar para o SAMU, telefone 192">
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>SAMU: 192</span>
          </a>
          <span className="hidden sm:inline text-sidebar-foreground/40" aria-hidden="true">·</span>
          <a href="tel:+551132291615" className="flex items-center gap-1.5 hover:text-accent transition-colors" aria-label="Ligar para Jogadores Anônimos, telefone 11, 3229-1615">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">JA: (11) 3229-1615</span>
            <span className="sm:hidden">JA</span>
          </a>
          <span className="hidden sm:inline text-sidebar-foreground/40" aria-hidden="true">·</span>
          <a
            href="https://autoexclusaoapostas.fazenda.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
            aria-label="Acessar site de autoexclusão de apostas do governo federal"
          >
            <Shield className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">autoexclusaoapostas.fazenda.gov.br</span>
            <span className="sm:hidden">Autoexclusão</span>
          </a>
        </nav>
        <div className="flex flex-col items-center mt-4">
          <img
            src="/logo-viverbem.png"
            alt="Logo Associação Viver Bem"
            className="h-10 rounded-lg shadow-sm mb-2"
          />
          <p className="text-center text-xs text-sidebar-foreground/70">
            Associação Viver Bem · www.associacaoviverbem.org.br · @proamiti
          </p>
          <p className="text-center text-xs mt-1 text-sidebar-foreground/60">
            Coordenação Científica: Dr. Hermano Tavares · Instituto de Psiquiatria HC-FMUSP · Ambulatório PRO-AMITI
          </p>
        </div>
      </div>
    </footer>
  );
}
