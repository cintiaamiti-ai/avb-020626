import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { saveEncrypted } from "@/lib/storage";

const AUDIO_TEXT = `Simuladores Interativos. Aqui você pode experienciar de forma segura como a mente é enganada pelas apostas. O caça-níquel mostra o efeito do quase ganho. O simulador de moeda explica a Falácia do Jogador. O Farol do Risco ajuda a identificar seu estado atual.`;

const SIMBOLOS = ["💎", "🍒", "🍋", "⭐", "🔔"];

// ─── CAÇA-NÍQUEL ──────────────────────────────────────────────────────────────

function CacaNiquel() {
  const [saldo, setSaldo] = useState(100);
  const [girando, setGirando] = useState(false);
  const [colunas, setColunas] = useState(["💎", "💎", "💎"]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [rodadas, setRodadas] = useState(0);
  const [animCols, setAnimCols] = useState([false, false, false]);
  const [acabou, setAcabou] = useState(false);
  // FASE 1 — BUG-01: refs para cleanup
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (t1.current) clearTimeout(t1.current);
      if (t2.current) clearTimeout(t2.current);
      if (t3.current) clearTimeout(t3.current);
    };
  }, []);

  const girar = () => {
    if (girando || saldo < 10 || acabou) return;
    setGirando(true);
    setAnimCols([true, true, true]);

    const novaRodada = rodadas + 1;
    setRodadas(novaRodada);

    let col1: string, col2: string, col3: string;
    if (novaRodada <= 2) {
      col1 = "💎"; col2 = "💎"; col3 = "🍒";
    } else {
      const rand = () => SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];
      col1 = rand(); col2 = rand(); col3 = rand();
    }

    t1.current = setTimeout(() => {
      setAnimCols([false, false, true]);
      setColunas([col1, col2, colunas[2]]);
    }, 600);

    t2.current = setTimeout(() => {
      setAnimCols([false, false, false]);
      setColunas([col1, col2, col3]);
      setSaldo((prev) => {
        const novo = prev - 10;
        if (novo <= 0) setAcabou(true);
        return Math.max(0, novo);
      });
      setGirando(false);
      if (novaRodada <= 2) {
        t3.current = setTimeout(() => setMostrarPopup(true), 200);
      }
    }, 1600);
  };

  const reiniciar = () => {
    setSaldo(100);
    setRodadas(0);
    setColunas(["💎", "💎", "💎"]);
    setAcabou(false);
    setMostrarPopup(false);
  };

  return (
    <div className="card-cordel p-6 mb-8">
      <div className="card-cordel p-3 mb-4 bg-[oklch(0.55_0.14_60/0.08)] border-[oklch(0.55_0.14_60)]">
        <div className="flex gap-2 items-start">
          <span className="text-sm shrink-0 mt-0.5" aria-hidden="true">⚠️</span>
          <p className="font-body text-xs">
            <strong>Atenção:</strong> Este simulador pode ativar impulsos. Se sentir desconforto, pare e use o{" "}
            <Link href="/sos" className="underline font-bold text-destructive">Botão SOS</Link>.
          </p>
        </div>
      </div>

      <h2 className="text-xl mb-1">Simulador 1 — O "Quase" que Custa Caro</h2>
      <p className="font-body text-sm text-muted-foreground mb-4">
        Gire o caça-níquel e observe como a máquina manipula sua atenção.
        <strong className="text-destructive"> Saldo virtual — não é dinheiro real.</strong>
      </p>

      <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-md border-2 border-foreground/20">
        <span className="font-body text-sm font-bold">Saldo virtual:</span>
        <span className={`font-body font-bold text-lg ${saldo <= 30 ? "text-destructive" : "text-accent"}`}
          aria-live="polite" aria-label={`Saldo virtual: R$ ${saldo}`}>
          R$ {saldo},00
        </span>
      </div>

      {/* Slot display */}
      <div className="flex gap-3 justify-center mb-6" aria-label="Caça-níquel virtual" role="img">
        {colunas.map((simbolo, i) => (
          <div
            key={i}
            className={`w-20 h-20 border-4 border-foreground rounded-xl flex items-center justify-center text-4xl bg-background shadow-inner transition-all ${
              animCols[i] ? "animate-pulse" : ""
            }`}
            aria-hidden="true"
          >
            {simbolo}
          </div>
        ))}
      </div>

      {acabou ? (
        <div className="text-center">
          <p className="font-body font-bold text-destructive mb-2">Saldo zerado.</p>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Isso é o que acontece com dinheiro real. A casa sempre vence no longo prazo.
          </p>
          <button
            onClick={reiniciar}
            className="inline-flex items-center gap-2 px-4 py-2 bg-muted border-2 border-foreground rounded-md font-body font-bold text-sm hover:bg-muted/70 transition-colors"
            aria-label="Reiniciar simulador do caça-níquel"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Reiniciar
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={girar}
            disabled={girando || saldo < 10}
            className="px-8 py-3 bg-primary text-primary-foreground font-body font-bold border-2 border-foreground rounded-md shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Girar o caça-níquel virtual"
          >
            {girando ? "Girando..." : "Girar (R$ 10)"}
          </button>
        </div>
      )}

      {/* Popup do quase-ganho */}
      <AnimatePresence>
        {mostrarPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Explicação sobre o quase-ganho"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="card-cordel p-6 max-w-sm w-full bg-background"
            >
              <p className="text-2xl text-center mb-3" aria-hidden="true">🎯</p>
              <h3 className="font-bold text-lg mb-3 text-center">O Efeito "Quase"</h3>
              <p className="font-body text-sm leading-relaxed mb-4">
                Você quase ganhou — dois 💎 e um 🍒. Esse resultado foi <strong>programado</strong>.
                O caça-níquel gera "quases" propositalmente para manter você jogando.
                Neurologicamente, "quase" ativa o mesmo circuito de recompensa que a vitória real.
              </p>
              <p className="font-body text-sm font-bold text-destructive mb-4">
                "Quase" é sempre derrota — com efeitos especiais.
              </p>
              <Button
                onClick={() => setMostrarPopup(false)}
                className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)]"
              >
                Entendi
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SIMULADOR DE MOEDA ───────────────────────────────────────────────────────

function SimuladorMoeda() {
  const [historico, setHistorico] = useState<string[]>([]);
  const [mostrarPopup, setMostrarPopup] = useState<"cara" | "coroa" | null>(null);
  const [escolha, setEscolha] = useState<"cara" | "coroa" | null>(null);

  const jogar = (lado: "cara" | "coroa") => {
    setEscolha(lado);
    const resultado = Math.random() < 0.5 ? "cara" : "coroa";
    setHistorico((h) => [resultado, ...h].slice(0, 20));
    setMostrarPopup(resultado === lado ? "cara" : "coroa");
  };

  const caras = historico.filter((h) => h === "cara").length;
  const coroas = historico.filter((h) => h === "coroa").length;

  return (
    <div className="card-cordel p-6 mb-8">
      <h2 className="text-xl mb-1">Simulador 2 — A Falácia do Jogador</h2>
      <p className="font-body text-sm text-muted-foreground mb-4">
        Cada lance é sempre 50/50, independente do que aconteceu antes.
        Escolha cara ou coroa:
      </p>

      <div className="flex gap-4 justify-center mb-6">
        {(["cara", "coroa"] as const).map((lado) => (
          <button
            key={lado}
            onClick={() => jogar(lado)}
            className="px-8 py-4 border-2 border-foreground rounded-md font-body font-bold capitalize hover:bg-muted transition-colors min-h-[56px]"
            aria-label={`Escolher ${lado}`}
          >
            {lado === "cara" ? "🟡 Cara" : "⚪ Coroa"}
          </button>
        ))}
      </div>

      {historico.length > 0 && (
        <div className="mb-4">
          <p className="font-body text-xs text-muted-foreground mb-2 text-center">
            Últimos {historico.length} lances: {caras} caras · {coroas} coroas
          </p>
          <div className="flex flex-wrap gap-1 justify-center" aria-label="Histórico de lances">
            {historico.map((r, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold ${
                  r === "cara" ? "bg-[oklch(0.55_0.14_60/0.3)]" : "bg-muted"
                }`}
                aria-hidden="true"
              >
                {r === "cara" ? "C" : "K"}
              </span>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {mostrarPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-cordel p-5 mt-4 bg-muted"
          >
            {mostrarPopup === "coroa" ? (
              <>
                <p className="text-2xl text-center mb-3" aria-hidden="true">🎲</p>
                <h3 className="font-bold text-lg mb-3 text-center text-destructive">
                  Não acertou desta vez.
                </h3>
                <p className="font-body text-sm leading-relaxed mb-4">
                  A moeda não tem memória. Cada lance é 50/50, independente do histórico.
                  Assim funcionam as apostas — cada rodada recomeça do zero.
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl text-center mb-3" aria-hidden="true">✅</p>
                <h3 className="font-bold text-lg text-accent mb-3 text-center">
                  Acertou! Mas foi sorte.
                </h3>
                <p className="font-body text-sm leading-relaxed mb-4">
                  A moeda não tem memória. Cada lance é sempre 50/50, independente do que
                  aconteceu antes. Esse entendimento protege você das armadilhas das plataformas.
                </p>
              </>
            )}
            <Button
              onClick={() => setMostrarPopup(null)}
              className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)]"
            >
              Entendi
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FAROL DO RISCO ───────────────────────────────────────────────────────────

function FarolRisco() {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  // FASE 1 — UX-01: linguagem corrigida: "Perigo"/"Incontrolável" → "Momento difícil"/"Impulso forte"
  // FASE 1 — BUG-02: storage.ts em vez de localStorage direto
  const opcoes = [
    {
      cor: "verde",
      emoji: "🟢",
      titulo: "Tranquilo",
      descricao: "Nenhuma vontade de jogar. Me sinto equilibrado.",
      bg: "bg-[oklch(0.50_0.14_155/0.08)] border-accent",
    },
    {
      cor: "amarelo",
      emoji: "🟡",
      titulo: "Alerta",
      descricao: "Estressado ou com pensamentos sobre apostas.",
      bg: "bg-[oklch(0.55_0.14_60/0.08)] border-[oklch(0.55_0.14_60)]",
    },
    {
      cor: "vermelho",
      emoji: "🔴",
      titulo: "Momento difícil",
      descricao: "Estou sentindo um impulso forte agora.",
      bg: "bg-[oklch(0.50_0.2_25/0.05)] border-destructive",
    },
  ];

  const handleSelecao = async (cor: string) => {
    setSelecionado(cor);
    const hoje = new Date().toISOString().split("T")[0];
    await saveEncrypted(`avb_farol_${hoje}`, cor);
  };

  return (
    <div className="card-cordel p-6">
      <h2 className="text-xl mb-1">Farol do Risco</h2>
      <p className="font-body text-sm text-muted-foreground mb-5">
        Como está sua vontade de jogar <strong>agora</strong>?
      </p>

      <div className="space-y-3 mb-4" role="radiogroup" aria-label="Estado emocional atual">
        {opcoes.map((op) => (
          <button
            key={op.cor}
            onClick={() => handleSelecao(op.cor)}
            role="radio"
            aria-checked={selecionado === op.cor}
            aria-label={`${op.titulo}: ${op.descricao}`}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 min-h-[56px] focus:ring-2 focus:ring-primary/50 focus:outline-none ${
              selecionado === op.cor
                ? op.bg + " shadow-[3px_3px_0_oklch(0.15_0.02_50)]"
                : "bg-background border-foreground/20 hover:border-foreground/60"
            }`}
          >
            <span className="text-3xl" aria-hidden="true">{op.emoji}</span>
            <div>
              <p className="font-body font-bold">{op.titulo}</p>
              <p className="font-body text-xs text-muted-foreground">{op.descricao}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selecionado && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-cordel p-4 bg-primary/5 border-primary"
          >
            {selecionado === "verde" && (
              <>
                <p className="font-body text-sm font-bold mb-2">
                  Bom momento para explorar as ferramentas.
                </p>
                <Link href="/exercicios" className="font-body text-sm text-primary underline">
                  Ir para os exercícios →
                </Link>
              </>
            )}
            {selecionado === "amarelo" && (
              <>
                <p className="font-body text-sm font-bold mb-2">
                  Algumas técnicas podem ajudar agora:
                </p>
                <div className="space-y-1">
                  <Link href="/exercicio/8" className="block font-body text-sm text-primary underline">
                    Respiração Quadrada →
                  </Link>
                  <Link href="/exercicio/7" className="block font-body text-sm text-primary underline">
                    Técnica 5-4-3-2-1 →
                  </Link>
                  <Link href="/crise" className="block font-body text-sm text-primary underline">
                    Modo Crise →
                  </Link>
                </div>
              </>
            )}
            {selecionado === "vermelho" && (
              <div>
                <p className="font-body text-sm font-bold mb-3">
                  O Botão SOS foi criado exatamente para esses momentos.
                </p>
                <Link
                  href="/sos"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[oklch(0.50_0.14_155)] text-white font-body font-bold rounded-md border-2 border-foreground min-h-[44px] hover:bg-[oklch(0.45_0.14_155)] transition-colors"
                  aria-label="Abrir o Botão SOS"
                >
                  🆘 Abrir Botão SOS
                </Link>
                <Link
                  href="/crise"
                  className="block text-center font-body text-sm text-primary underline mt-3"
                  aria-label="Ir para o Modo Crise"
                >
                  Modo Crise — passo a passo →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────

export default function Simuladores() {
  return (
    <PageAudioWrapper pageText={AUDIO_TEXT} label="Ouvir sobre os simuladores">
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
            <h1 className="text-2xl sm:text-3xl mb-2">Simuladores Interativos</h1>
            <p className="font-body text-muted-foreground mb-8">
              Experimente de forma segura como a mente é enganada.
              Nenhum dinheiro real envolvido.
            </p>
          </motion.div>

          <CacaNiquel />
          <SimuladorMoeda />
          <FarolRisco />
        </div>
      </div>
    </PageAudioWrapper>
  );
}
