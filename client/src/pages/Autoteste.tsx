import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ClipboardCheck, Phone, Users, CheckCircle2, Info, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
// AppContext não é necessário nesta versão do Autoteste

const AUDIO_TEXT = `Autoteste do Jogo. Responda às perguntas com honestidade. Este autoteste pode auxiliar a refletir sobre sua relação com jogos. Não é um diagnóstico médico.`;

const questoes = [
  {
    id: "q1",
    texto: "Você já tentou parar, reduzir ou controlar o seu jogo? Se sim, isso já lhe aconteceu três vezes ou mais?",
  },
  {
    id: "q2",
    texto: "Quando você joga e perde, houve momentos em que voltou para recuperar o dinheiro perdido na rodada anterior?",
  },
  {
    id: "q3",
    texto: "Você já jogou para aliviar sentimentos desconfortáveis (culpa, ansiedade, tristeza, depressão)?",
  },
  {
    id: "q4",
    texto: "Em uma ou mais das vezes em que tentou parar, ficou inquieto, irritado ou agitado?",
    condicional: true,
  },
];

// FASE 1 — BUG-04/05: linguagem clínica corrigida. Sem "Possíveis problemas" nem "Impactos significativos"
const resultados: Record<number, {
  cor: string;
  bgCor: string;
  titulo: string;
  texto: string;
}> = {
  0: {
    cor: "text-accent",
    bgCor: "bg-[oklch(0.50_0.14_155/0.08)] border-accent",
    titulo: "Nenhum sinal identificado agora",
    texto: "Neste momento você não apresentou sinais de alerta. O Transtorno do Jogo se desenvolve gradualmente — manter-se informado é a melhor prevenção.",
  },
  1: {
    cor: "text-[oklch(0.55_0.14_60)]",
    bgCor: "bg-[oklch(0.55_0.14_60/0.08)] border-[oklch(0.55_0.14_60)]",
    titulo: "Algo merece atenção",
    texto: "Você pode estar apresentando sinais de alerta. Reflita sobre sua relação com o jogo e busque acolhimento quando sentir que é a hora certa.",
  },
  2: {
    cor: "text-[oklch(0.60_0.18_40)]",
    bgCor: "bg-[oklch(0.60_0.18_40/0.08)] border-[oklch(0.60_0.18_40)]",
    titulo: "Sua experiência importa",
    texto: "Sua relação com o jogo pode estar te afetando. Buscar apoio em uma UBS ou CAPS próximo pode ajudar — você não precisa lidar com isso sozinho.",
  },
  3: {
    cor: "text-destructive",
    bgCor: "bg-[oklch(0.50_0.2_25/0.08)] border-destructive",
    titulo: "Você merece apoio",
    texto: "O jogo parece estar tendo impactos na sua vida. Buscar apoio de um profissional pode ajudar muito nesse momento. Isso não é fraqueza — é cuidado.",
  },
  4: {
    cor: "text-destructive",
    bgCor: "bg-[oklch(0.50_0.2_25/0.12)] border-destructive",
    titulo: "Você merece apoio especializado",
    texto: "Você apresenta vários sinais de dificuldades com o jogo. Isso não é fraqueza — é uma condição de saúde tratável. Um profissional pode te ajudar a encontrar o caminho.",
  },
};

// FASE 3 — PSI-03: estados de transição para buffer emocional
type Etapa = "perguntas" | "buffer" | "resultado";

export default function Autoteste() {
  const [respostas, setRespostas] = useState<Record<string, boolean | null>>({
    q1: null, q2: null, q3: null, q4: null,
  });
  const [etapa, setEtapa] = useState<Etapa>("perguntas");

  const mostrarQ4 =
    respostas.q1 === true || respostas.q2 === true || respostas.q3 === true;

  const responder = (id: string, valor: boolean) => {
    setRespostas((prev) => ({ ...prev, [id]: valor }));
  };

  const podeCalcular = () => {
    if (respostas.q1 === null || respostas.q2 === null || respostas.q3 === null) return false;
    if (mostrarQ4 && respostas.q4 === null) return false;
    return true;
  };

  const calcularPontuacao = () => {
    let pts = 0;
    if (respostas.q1) pts++;
    if (respostas.q2) pts++;
    if (respostas.q3) pts++;
    if (mostrarQ4 && respostas.q4) pts++;
    return pts;
  };

  const pontuacao = calcularPontuacao();
  const resultado = resultados[pontuacao];

  const reiniciar = () => {
    setEtapa("perguntas");
    setRespostas({ q1: null, q2: null, q3: null, q4: null });
  };

  return (
    <PageAudioWrapper pageText={AUDIO_TEXT} label="Ouvir instruções do autoteste">
      <div className="flex-1 container py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <ClipboardCheck className="w-7 h-7 text-primary" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl">Autoteste do Jogo</h1>
            </div>
            <p className="font-body text-muted-foreground mb-6">
              Responda com honestidade. Não existe resposta certa ou errada.
            </p>
          </motion.div>

          <div className="card-cordel p-4 bg-[oklch(0.50_0.14_155/0.08)] border-accent mb-6" role="note">
            <p className="font-body text-xs font-bold text-accent mb-1">Sobre este autoteste</p>
            <p className="font-body text-sm">
              Este autoteste pode auxiliar a refletir sobre sua relação com jogos.
              <strong> Não é um diagnóstico médico.</strong> É uma ferramenta de autoconhecimento.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ETAPA 1: Perguntas */}
            {etapa === "perguntas" && (
              <motion.div
                key="perguntas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {questoes.map((q, idx) => {
                  if (q.condicional && !mostrarQ4) return null;
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="card-cordel p-5"
                    >
                      <p className="font-body text-sm font-semibold mb-4 leading-relaxed" id={`label-${q.id}`}>
                        {idx + 1}. {q.texto}
                        {q.condicional && (
                          <span className="block text-xs text-accent mt-1">
                            (pergunta adicional — ativada pelas suas respostas anteriores)
                          </span>
                        )}
                      </p>
                      <div className="flex gap-3" role="group" aria-labelledby={`label-${q.id}`}>
                        <button
                          onClick={() => responder(q.id, true)}
                          aria-pressed={respostas[q.id] === true}
                          aria-label={`Resposta Sim para: ${q.texto}`}
                          className={`flex-1 py-3 rounded-md border-2 font-body font-bold text-sm transition-all min-h-[44px] focus:ring-2 focus:ring-primary/50 focus:outline-none ${
                            respostas[q.id] === true
                              ? "bg-destructive text-destructive-foreground border-destructive shadow-[3px_3px_0_oklch(0.15_0.02_50)]"
                              : "border-foreground/30 hover:border-foreground"
                          }`}
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => responder(q.id, false)}
                          aria-pressed={respostas[q.id] === false}
                          aria-label={`Resposta Não para: ${q.texto}`}
                          className={`flex-1 py-3 rounded-md border-2 font-body font-bold text-sm transition-all min-h-[44px] focus:ring-2 focus:ring-accent/50 focus:outline-none ${
                            respostas[q.id] === false
                              ? "bg-accent text-white border-accent shadow-[3px_3px_0_oklch(0.15_0.02_50)]"
                              : "border-foreground/30 hover:border-foreground"
                          }`}
                        >
                          Não
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                <Button
                  onClick={() => setEtapa("buffer")}
                  disabled={!podeCalcular()}
                  size="lg"
                  className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" aria-hidden="true" />
                  Ver resultado
                </Button>
              </motion.div>
            )}

            {/* ETAPA 2: Buffer emocional — FASE 3 PSI-03 */}
            {etapa === "buffer" && (
              <motion.div
                key="buffer"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="card-cordel p-8 text-center"
              >
                <Heart className="w-12 h-12 text-accent mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-xl mb-3">Obrigado por responder.</h2>
                <p className="font-body text-muted-foreground mb-6">
                  Responder essas perguntas requer honestidade consigo mesmo.
                  Isso já é um passo importante.
                </p>
                <Button
                  onClick={() => setEtapa("resultado")}
                  size="lg"
                  className="border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold"
                >
                  Ver meu resultado
                </Button>
              </motion.div>
            )}

            {/* ETAPA 3: Resultado */}
            {etapa === "resultado" && (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`card-cordel p-6 mb-6 ${resultado.bgCor}`} role="region" aria-label="Resultado do autoteste">
                  {/* FASE 1 — UX-04: sem pontuação numérica visível ao usuário */}
                  <h2 className={`text-xl font-bold mb-2 ${resultado.cor}`}>
                    {resultado.titulo}
                  </h2>
                  <p className="font-body text-sm leading-relaxed">
                    {resultado.texto}
                  </p>
                </div>

                {pontuacao === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-cordel p-4 mb-6 bg-[oklch(0.45_0.12_250/0.05)]"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="font-body text-sm">
                        Se você chegou até aqui, pode ser um bom momento para explorar as ferramentas
                        do app como prevenção. O Transtorno do Jogo se desenvolve gradualmente —
                        conhecer suas armadilhas agora é a melhor proteção.
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        href="/distorcoes"
                        className="font-body text-xs font-bold px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                      >
                        Distorções Cognitivas
                      </Link>
                      <Link
                        href="/matematica"
                        className="font-body text-xs font-bold px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                      >
                        Realidade Matemática
                      </Link>
                    </div>
                  </motion.div>
                )}

                {pontuacao >= 1 && (
                  <div className="card-cordel p-5 mb-6">
                    <p className="font-body text-sm font-bold mb-3">Recursos disponíveis agora:</p>
                    <div className="space-y-2">
                      <a
                        href="tel:188"
                        className="flex items-center gap-3 p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                        aria-label="Ligar para o CVV: 188 — apoio emocional 24 horas"
                      >
                        <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                        <div>
                          <p className="font-body text-sm font-bold">CVV — 188</p>
                          <p className="font-body text-xs text-muted-foreground">Apoio emocional 24h · Gratuito · Sigiloso</p>
                        </div>
                      </a>
                      <a
                        href="tel:+551132291615"
                        className="flex items-center gap-3 p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                        aria-label="Ligar para Jogadores Anônimos: 11 3229-1615"
                      >
                        <Users className="w-4 h-4 text-accent" aria-hidden="true" />
                        <div>
                          <p className="font-body text-sm font-bold">Jogadores Anônimos</p>
                          <p className="font-body text-xs text-muted-foreground">(11) 3229-1615 · Grupos presenciais e online</p>
                        </div>
                      </a>
                      <Link
                        href="/rede-apoio"
                        className="flex items-center gap-3 p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-secondary" aria-hidden="true" />
                        <p className="font-body text-sm font-bold">Ver todos os recursos de apoio →</p>
                      </Link>
                    </div>
                  </div>
                )}

                <p className="font-body text-xs text-center text-muted-foreground mb-4">
                  Você pode repetir este autoteste quando quiser — não há frequência obrigatória.
                </p>

                <Button
                  onClick={reiniciar}
                  variant="outline"
                  className="w-full border-2 border-foreground font-body"
                >
                  Refazer o autoteste
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageAudioWrapper>
  );
}
