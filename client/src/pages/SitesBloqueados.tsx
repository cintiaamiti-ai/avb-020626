import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Shield, Copy, CheckCircle, Download, Globe, Monitor, Smartphone } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AUDIO_TEXT = `Bloqueador de Sites de Apostas. Aqui você encontra ferramentas para bloquear o acesso a 66 plataformas de apostas no seu computador ou celular. Você pode copiar a lista de sites para bloquear manualmente, gerar um arquivo hosts para Windows ou Mac, ou usar uma extensão para o navegador Chrome. Bloquear o acesso é uma barreira extra que te dá tempo para pensar antes de agir.`;

const plataformas = [
  "bet365.com", "betano.com", "sportingbet.com", "pixbet.com", "betfair.com",
  "betnacional.com", "novibet.com", "parimatch.com", "stake.com", "blaze.com",
  "estrela-bet.com", "kto.com", "galera.bet", "betway.com", "pinnacle.com",
  "1xbet.com", "22bet.com", "rivalo.com", "mrjack.bet", "superbet.com",
  "f12.bet", "luva.bet", "vaidebet.com", "casa-de-apostas.com", "betsson.com",
  "leovegas.com", "bodog.com", "pokerstars.com", "888sport.com", "williamhill.com",
  "unibet.com", "bwin.com", "ladbrokes.com", "coral.co.uk", "paddypower.com",
  "draftkings.com", "fanduel.com", "caesars.com", "betmgm.com", "pointsbet.com",
  "sportsbet.io", "cloudbet.com", "thunderpick.io", "rollbit.com", "roobet.com",
  "duelbits.com", "gamdom.com", "csgoempire.com", "shuffle.com", "metabet.com",
  "esportes-da-sorte.com", "realsbet.com", "brabet.com", "aposta-ganha.com", "betpix365.com",
  "jogodobicho.com", "lottoland.com", "tigrinho.com", "fortunetiger.com", "aviator.com",
  "spaceman.com", "mines.com", "crash.com", "slots.com", "cassino.com",
  "jogo-do-tigrinho.com",
];

export default function SitesBloqueados() {
  const [copiado, setCopiado] = useState(false);
  // FASE 1 — BUG-01: useRef para cleanup do setTimeout
  const copiadoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiadoTimerRef.current) clearTimeout(copiadoTimerRef.current);
    };
  }, []);

  const gerarHosts = () => {
    const linhas = plataformas.map((site) => `0.0.0.0 ${site}\n0.0.0.0 www.${site}`);
    return `# Bloqueio de sites de apostas - Gerado pelo app "Quando o Jogo Vira Problema"\n# Adicione ao final do arquivo hosts do seu sistema\n# Windows: C:\\Windows\\System32\\drivers\\etc\\hosts\n# Mac/Linux: /etc/hosts\n\n${linhas.join("\n")}\n`;
  };

  const copiarHosts = () => {
    navigator.clipboard.writeText(gerarHosts());
    setCopiado(true);
    toast.success("Lista copiada! Cole no arquivo hosts.");
    if (copiadoTimerRef.current) clearTimeout(copiadoTimerRef.current);
    copiadoTimerRef.current = setTimeout(() => setCopiado(false), 3000);
  };

  const baixarHosts = () => {
    const blob = new Blob([gerarHosts()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hosts-bloqueio-apostas.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo baixado! Siga as instruções para instalar.");
  };

  return (
    <PageAudioWrapper pageText={AUDIO_TEXT} label="Ouvir instruções">
      <div className="flex-1 container py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-7 h-7 text-primary" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl">Bloqueador de Sites</h1>
            </div>
            <p className="font-body text-muted-foreground mb-6">
              Bloqueie {plataformas.length} plataformas de apostas no seu dispositivo.
              Uma barreira extra que te dá tempo para pensar antes de agir.
            </p>
          </motion.div>

          {/* Opções de plataforma */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icone: Monitor, titulo: "Windows / Mac", descricao: "Bloqueio via arquivo hosts do sistema" },
              { icone: Globe, titulo: "Chrome", descricao: "Extensão BlockSite ou uBlacklist" },
              { icone: Smartphone, titulo: "Android", descricao: "App BlockSite ou DNS personalizado" },
            ].map((item) => (
              <div key={item.titulo} className="card-cordel p-4 text-center">
                <item.icone className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
                <p className="font-body font-bold text-sm mb-1">{item.titulo}</p>
                <p className="font-body text-xs text-muted-foreground">{item.descricao}</p>
              </div>
            ))}
          </div>

          {/* Arquivo hosts */}
          <section aria-label="Arquivo hosts para bloqueio" className="card-cordel p-6 mb-6">
            <h2 className="text-lg mb-2">Arquivo Hosts (Windows / Mac / Linux)</h2>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Copie o arquivo abaixo e cole no final do arquivo <code className="bg-muted px-1 rounded">hosts</code> do seu sistema.
            </p>

            <div className="bg-muted rounded-md p-3 mb-4 max-h-40 overflow-y-auto">
              <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                {plataformas.slice(0, 10).map((s) => `0.0.0.0 ${s}`).join("\n")}
                {"\n"}... e mais {plataformas.length - 10} sites
              </pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={copiarHosts}
                variant="outline"
                className="border-2 border-foreground font-body font-bold gap-2"
                aria-label="Copiar arquivo hosts para área de transferência"
              >
                {copiado ? (
                  <><CheckCircle className="w-4 h-4" aria-hidden="true" /> Copiado!</>
                ) : (
                  <><Copy className="w-4 h-4" aria-hidden="true" /> Copiar hosts</>
                )}
              </Button>
              <Button
                onClick={baixarHosts}
                className="border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
                aria-label="Baixar arquivo hosts como arquivo de texto"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Baixar arquivo
              </Button>
            </div>
          </section>

          {/* Lista de sites */}
          <section aria-label="Lista de plataformas bloqueadas" className="card-cordel p-6 mb-6">
            <h2 className="text-lg mb-4">{plataformas.length} Plataformas Incluídas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto">
              {plataformas.map((site) => (
                <span
                  key={site}
                  className="font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground truncate"
                >
                  {site}
                </span>
              ))}
            </div>
          </section>

          {/* Instrução gov.br */}
          <div className="card-cordel p-5 bg-[oklch(0.50_0.14_155/0.07)] border-accent">
            <p className="font-body text-sm font-bold mb-2">Bloqueio oficial pelo gov.br</p>
            <p className="font-body text-sm text-muted-foreground mb-3">
              O governo federal oferece autoexclusão de plataformas reguladas.
            </p>
            <a
              href="https://autoexclusaoapostas.fazenda.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm font-bold text-primary underline hover:text-primary/80"
              aria-label="Acessar autoexclusão de apostas no site do governo federal (abre em nova aba)"
            >
              autoexclusaoapostas.fazenda.gov.br →
            </a>
          </div>
        </div>
      </div>
    </PageAudioWrapper>
  );
}
