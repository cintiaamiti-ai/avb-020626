import { Phone, Heart, Shield, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t-3 border-foreground bg-[oklch(0.20_0.03_50)] text-[oklch(0.92_0.01_75)] py-4" role="contentinfo" aria-label="Contatos de emergência e créditos">
      <div className="container">
        <nav aria-label="Contatos de emergência" className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm font-body font-semibold">
          <a href="tel:188" className="flex items-center gap-1.5 hover:text-[oklch(0.65_0.15_80)] transition-colors" aria-label="Ligar para o CVV, Centro de Valorização da Vida, telefone 188">
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>CVV: 188</span>
          </a>
          <span className="hidden sm:inline text-[oklch(0.5_0.02_50)]" aria-hidden="true">·</span>
          <a href="tel:136" className="flex items-center gap-1.5 hover:text-[oklch(0.50_0.14_155)] transition-colors" aria-label="Ligar para o SUS, telefone 136">
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span>SUS: 136</span>
          </a>
          <span className="hidden sm:inline text-[oklch(0.5_0.02_50)]" aria-hidden="true">·</span>
          <a href="tel:192" className="flex items-center gap-1.5 hover:text-[oklch(0.50_0.2_25)] transition-colors" aria-label="Ligar para o SAMU, telefone 192">
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>SAMU: 192</span>
          </a>
          <span className="hidden sm:inline text-[oklch(0.5_0.02_50)]" aria-hidden="true">·</span>
          <a href="tel:+551132291615" className="flex items-center gap-1.5 hover:text-[oklch(0.50_0.14_155)] transition-colors" aria-label="Ligar para Jogadores Anônimos, telefone 11, 3229-1615">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">JA: (11) 3229-1615</span>
            <span className="sm:hidden">JA</span>
          </a>
          <span className="hidden sm:inline text-[oklch(0.5_0.02_50)]" aria-hidden="true">·</span>
          <a
            href="https://autoexclusaoapostas.fazenda.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[oklch(0.45_0.15_240)] transition-colors"
            aria-label="Acessar site de autoexclusão de apostas do governo federal"
          >
            <Shield className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">autoexclusaoapostas.fazenda.gov.br</span>
            <span className="sm:hidden">Autoexclusão</span>
          </a>
        </nav>
        <p className="text-center text-xs mt-3 text-[oklch(0.6_0.02_50)]">
          Associação Viver Bem · www.associacaoviverbem.org.br · @proamiti
        </p>
        <p className="text-center text-xs mt-1 text-[oklch(0.5_0.02_50)]">
          Coordenação Científica: Dr. Hermano Tavares · Instituto de Psiquiatria HC-FMUSP · Ambulatório PRO-AMITI
        </p>
      </div>
    </footer>
  );
}
