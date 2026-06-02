import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Wind, Eye, Shield, Users, Phone, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const CRISE_AUDIO_TEXT = `Modo Crise. Você está em um momento difícil. Isso vai passar. Vamos juntos, um passo de cada vez. Primeiro: Respiração guiada para acalmar o sistema nervoso. Depois: Técnica cinco-quatro-três-dois-um para se ancorar no presente. Em seguida: Seus motivos para não jogar. Depois: Sua rede de apoio. E por último: Jogadores Anônimos e CVV, disponíveis agora.`;

// ─── Respiração Guiada ────────────────────────────────────────────────────────

type FaseRespiracao = "inspire" | "segure" | "expire" | "pause" | "pronto";

const CICLOS_TOTAL = 4;
const FASES: { fase: FaseRespiracao; duracao: number; label: string; instrucao: string }[] = [
  { fase: "inspire", duracao: 4, label: "Inspire", instrucao: "Respire fundo pelo nariz..." },
  { fase: "segure", duracao: 4, label: "Segure", instrucao: "Segure o ar suavemente..." },
  { fase: "expire", duracao: 4, label: "Expire", instrucao: "Solte devagar pela boca..." },
  { fase: "pause", duracao: 4, label: "Pausa", instrucao: "Descanse antes do próximo ciclo..." },
];

function RespGuiada({ onConcluir }: { onConcluir: () => void }) {
  const [faseIdx, setFaseIdx] = useState(0);
  const [contador, setContador] = useState(FASES[0].duracao);
  const [ciclo, setCiclo] = useState(1);
  const [ativo, setAtivo] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const faseAtual = FASES[faseIdx];

  useEffect(() => {
    if (!ativo) return;

    timerRef.current = setInterval(() => {
      setContador((c) => {
        if (c <= 1) {
          // Avança para próxima fase
          setFaseIdx((fi) => {
            const proximo = (fi + 1) % FASES.length;
            if (proximo === 0) {
              // Completou um ciclo
              setCiclo((cc) => {
                if (cc >= CICLOS_TOTAL) {
                  clearInterval(timerRef.current!);
                  setAtivo(false);
                  setConcluido(true);
                  return cc;
                }
                return cc + 1;
              });
            }
            setContador(FASES[proximo].duracao);
            return proximo;
          });
          return FASES[faseIdx].duracao;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [ativo, faseIdx]);

  const progresso = ((FASES[0].duracao - contador) / FASES[0].duracao) * 100;
  const circunferencia = 2 * Math.PI * 44;

  if (concluido) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6"
      >
        <p className="text-4xl mb-3">🌿</p>
        <p className="font-body font-semibold text-foreground mb-1">
          Muito bem. {CICLOS_TOTAL} ciclos concluídos.
        </p>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Seu sistema nervoso está mais calmo agora.
        </p>
        <Button
          onClick={onConcluir}
          className="border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
        >
          Continuar <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="text-center py-4">
      <p className="font-body text-sm text-muted-foreground mb-6">
        Respiração quadrada • {CICLOS_TOTAL} ciclos para acalmar o sistema nervoso
      </p>

      {/* Círculo animado */}
      <div className="relative w-44 h-44 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="oklch(0.92 0.02 75)"
            strokeWidth="5"
          />
          {ativo && (
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="oklch(0.50 0.14 155)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia * (1 - contador / FASES[faseIdx].duracao)}
              className="transition-all duration-1000"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {ativo ? (
            <>
              <span className="text-3xl font-bold font-body tabular-nums">{contador}</span>
              <span className="text-sm font-body font-semibold text-primary mt-1">
                {faseAtual.label}
              </span>
            </>
          ) : (
            <Wind className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
      </div>

      {ativo && (
        <motion.p
          key={faseIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-body text-sm text-foreground mb-2"
        >
          {faseAtual.instrucao}
        </motion.p>
      )}

      <p className="font-body text-xs text-muted-foreground mb-6">
        {ativo ? `Ciclo ${ciclo} de ${CICLOS_TOTAL}` : "Quando estiver pronto, inicie a respiração"}
      </p>

      {!ativo ? (
        <Button
          onClick={() => setAtivo(true)}
          className="border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
        >
          <Wind className="w-4 h-4" />
          Iniciar respiração
        </Button>
      ) : (
        <button
          onClick={() => {
            setAtivo(false);
            setFaseIdx(0);
            setContador(FASES[0].duracao);
            setCiclo(1);
          }}
          className="font-body text-xs text-muted-foreground underline"
        >
          Pausar
        </button>
      )}

      <div className="mt-4">
        <button
          onClick={onConcluir}
          className="font-body text-xs text-muted-foreground underline"
        >
          Pular esta etapa
        </button>
      </div>
    </div>
  );
}

// ─── Técnica 5-4-3-2-1 ───────────────────────────────────────────────────────

function Tecnica54321({ onConcluir }: { onConcluir: () => void }) {
  const [etapaIdx, setEtapaIdx] = useState(0);
  const [respostas, setRespostas] = useState<string[]>(["", "", "", "", ""]);

  const etapas = [
    { n: 5, sentido: "VEJO", icone: "👀", instrucao: "Olhe ao redor. Descreva 5 coisas que você vê agora." },
    { n: 4, sentido: "TOCO", icone: "✋", instrucao: "Toque algo perto. Descreva 4 texturas ou superfícies." },
    { n: 3, sentido: "OUÇO", icone: "👂", instrucao: "Preste atenção. Quais são 3 sons ao seu redor?" },
    { n: 2, sentido: "CHEIRO", icone: "👃", instrucao: "Respire fundo. Quais 2 cheiros você identifica?" },
    { n: 1, sentido: "SABOREIO", icone: "👅", instrucao: "Preste atenção na boca. Qual sabor você percebe?" },
  ];

  const etapa = etapas[etapaIdx];
  const totalEtapas = etapas.length;

  return (
    <div className="py-4">
      <p className="font-body text-sm text-muted-foreground mb-6 text-center">
        Esta técnica te traz para o momento presente usando seus 5 sentidos.
      </p>

      {/* Progresso */}
      <div className="flex gap-1.5 mb-6">
        {etapas.map((e, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i <= etapaIdx ? "bg-accent" : "bg-foreground/15"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={etapaIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-cordel p-5 mb-6"
        >
          <div className="text-center mb-4">
            <span className="text-4xl" aria-hidden="true">{etapa.icone}</span>
            <p className="font-body font-bold text-lg mt-2">
              {etapa.n} coisas que {etapa.sentido}
            </p>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {etapa.instrucao}
            </p>
          </div>
          <textarea
            value={respostas[etapaIdx]}
            onChange={(e) => {
              const novas = [...respostas];
              novas[etapaIdx] = e.target.value;
              setRespostas(novas);
            }}
            placeholder="Escreva aqui o que percebe..."
            rows={3}
            className="w-full p-3 font-body text-sm border-2 border-foreground rounded-md bg-background resize-none focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        {etapaIdx > 0 ? (
          <button
            onClick={() => setEtapaIdx((i) => i - 1)}
            className="font-body text-sm text-muted-foreground flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Anterior
          </button>
        ) : (
          <div />
        )}

        {etapaIdx < totalEtapas - 1 ? (
          <Button
            onClick={() => setEtapaIdx((i) => i + 1)}
            className="border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
          >
            Próximo <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onConcluir}
            className="border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
          >
            Continuar <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="text-center mt-3">
        <button
          onClick={onConcluir}
          className="font-body text-xs text-muted-foreground underline"
        >
          Pular esta etapa
        </button>
      </div>
    </div>
  );
}

// ─── Motivos para não jogar ───────────────────────────────────────────────────

function MotivosPessoais({ onConcluir }: { onConcluir: () => void }) {
  return (
    <div className="py-4">
      <p className="font-body text-sm text-muted-foreground text-center mb-6">
        Lembre-se do que você está protegendo.
      </p>

      <div className="space-y-3 mb-6">
        {[
          { icone: "💰", texto: "O dinheiro que eu não vou perder hoje fica disponível para o que realmente importa." },
          { icone: "👨‍👩‍👧", texto: "As pessoas que me amam merecem minha presença — não uma versão desgastada." },
          { icone: "🌱", texto: "Cada vez que eu resisto, estou construindo algo." },
          { icone: "🧠", texto: "O impulso vai passar. Sempre passou antes." },
          { icone: "💪", texto: "Já superei momentos difíceis. Posso superar esse também." },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-4 bg-[oklch(0.50_0.14_155/0.07)] rounded-md border border-accent/30"
          >
            <span className="text-xl shrink-0" aria-hidden="true">{item.icone}</span>
            <p className="font-body text-sm text-foreground">{item.texto}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mb-4">
        <Link
          href="/balanca-decisoria"
          className="font-body text-xs text-primary underline"
        >
          Adicionar meus motivos pessoais na Balança Decisória
        </Link>
      </div>

      <Button
        onClick={onConcluir}
        className="w-full border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
      >
        <Shield className="w-4 h-4" />
        Continuar
      </Button>
    </div>
  );
}

// ─── Rede de Apoio ────────────────────────────────────────────────────────────

function RedeApoio({ onConcluir }: { onConcluir: () => void }) {
  return (
    <div className="py-4">
      <p className="font-body text-sm text-muted-foreground text-center mb-6">
        Você não precisa passar por isso sozinho.
      </p>

      <div className="space-y-3 mb-6">
        <a
          href="tel:188"
          className="flex items-center gap-3 p-4 bg-muted rounded-md border border-foreground/20 hover:bg-muted/70 transition-colors"
          aria-label="Ligar para o CVV: 188"
        >
          <Phone className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="font-body font-bold text-sm">CVV — 188</p>
            <p className="font-body text-xs text-muted-foreground">
              Apoio emocional 24h · Gratuito · Sigiloso
            </p>
          </div>
        </a>

        <a
          href="tel:+551132291615"
          className="flex items-center gap-3 p-4 bg-muted rounded-md border border-foreground/20 hover:bg-muted/70 transition-colors"
          aria-label="Ligar para Jogadores Anônimos"
        >
          <Users className="w-5 h-5 text-accent shrink-0" />
          <div>
            <p className="font-body font-bold text-sm">
              Jogadores Anônimos — (11) 3229-1615
            </p>
            <p className="font-body text-xs text-muted-foreground">
              Grupo de apoio entre iguais · Gratuito · Sigiloso
            </p>
          </div>
        </a>
      </div>

      <Link
        href="/rede-apoio"
        className="block text-center font-body text-sm text-primary underline hover:text-primary/80 mb-6"
      >
        Ver minha rede de apoio pessoal
      </Link>

      <Button
        onClick={onConcluir}
        className="w-full border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
      >
        Concluir modo crise
      </Button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const ETAPAS = [
  { id: "respiracao", titulo: "Respiração Guiada", icone: Wind },
  { id: "54321", titulo: "Técnica 5-4-3-2-1", icone: Eye },
  { id: "motivos", titulo: "Motivos para não jogar", icone: Shield },
  { id: "apoio", titulo: "Rede de Apoio", icone: Users },
];

export default function ModoCrise() {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [concluido, setConcluido] = useState(false);

  const avancar = () => {
    if (etapaAtual < ETAPAS.length - 1) {
      setEtapaAtual((e) => e + 1);
    } else {
      setConcluido(true);
    }
  };

  const reiniciar = () => {
    setEtapaAtual(0);
    setConcluido(false);
  };

  return (
    <PageAudioWrapper pageText={CRISE_AUDIO_TEXT} label="Ouvir modo crise">
      <div className="flex-1 container py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl mb-2">Modo Crise</h1>
            <p className="font-body text-muted-foreground mb-6">
              Você está em um momento difícil. Isso vai passar.
              Vamos juntos, um passo de cada vez.
            </p>
          </motion.div>

          {concluido ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-cordel p-8 text-center"
            >
              <span className="text-5xl block mb-4" aria-hidden="true">🌤️</span>
              <h2 className="text-xl mb-3">Você passou por isso.</h2>
              <p className="font-body text-muted-foreground mb-6">
                Percorreu todas as etapas. Isso requer coragem.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-md border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:opacity-90 transition-opacity text-center"
                >
                  Voltar ao início
                </Link>
                <button
                  onClick={reiniciar}
                  className="flex items-center justify-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                  Percorrer novamente
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Progresso das etapas */}
              <div className="flex gap-2 mb-8">
                {ETAPAS.map((e, i) => {
                  const Icone = e.icone;
                  return (
                    <div
                      key={e.id}
                      className={`flex-1 flex flex-col items-center gap-1 ${
                        i < etapaAtual
                          ? "opacity-40"
                          : i === etapaAtual
                          ? "opacity-100"
                          : "opacity-20"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          i === etapaAtual
                            ? "bg-primary border-foreground"
                            : i < etapaAtual
                            ? "bg-accent border-accent"
                            : "bg-muted border-foreground/20"
                        }`}
                      >
                        <Icone className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <span className="font-body text-[10px] text-muted-foreground text-center leading-tight hidden sm:block">
                        {e.titulo}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Conteúdo da etapa */}
              <div className="card-cordel p-6">
                <h2 className="text-lg mb-1">
                  {ETAPAS[etapaAtual].titulo}
                </h2>
                <p className="font-body text-xs text-muted-foreground mb-4">
                  Etapa {etapaAtual + 1} de {ETAPAS.length}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={etapaAtual}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {etapaAtual === 0 && <RespGuiada onConcluir={avancar} />}
                    {etapaAtual === 1 && <Tecnica54321 onConcluir={avancar} />}
                    {etapaAtual === 2 && <MotivosPessoais onConcluir={avancar} />}
                    {etapaAtual === 3 && <RedeApoio onConcluir={avancar} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </PageAudioWrapper>
  );
}
