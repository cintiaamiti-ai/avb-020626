import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, TrendingUp, TrendingDown, CheckCircle2,
  BarChart3, Download, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { saveEncrypted, loadEncrypted } from "@/lib/storage";

const AUDIO_TEXT = `Escala Semanal do Jogo. Responda às questões sobre os últimos 7 dias. Acompanhe sua evolução ao longo das semanas.`;

const questoes = [
  {
    id: "e1",
    texto: "Com que frequência você jogou na última semana?",
    opcoes: [
      { label: "Joguei todos os dias", pontos: 1 },
      { label: "Joguei mais de uma vez", pontos: 2 },
      { label: "Joguei uma vez", pontos: 3 },
      { label: "Joguei ocasionalmente", pontos: 4 },
      { label: "Não joguei", pontos: 5 },
    ],
  },
  {
    id: "e2",
    texto: "Qual foi o tempo máximo que você jogou sem parar?",
    opcoes: [
      { label: "Mais de 12 horas", pontos: 1 },
      { label: "De 8 a 12 horas", pontos: 2 },
      { label: "De 4 a 8 horas", pontos: 3 },
      { label: "Menos de 4 horas", pontos: 4 },
      { label: "Não joguei", pontos: 5 },
    ],
  },
  {
    id: "e3",
    texto: "Como foram suas perdas financeiras em relação à sua renda?",
    opcoes: [
      { label: "Perdi dinheiro de outras pessoas ou de forma irregular", pontos: 1 },
      { label: "Perdi mais do que minha renda do período", pontos: 2 },
      { label: "Perdi entre metade e o total da minha renda", pontos: 3 },
      { label: "Perdi menos da metade da minha renda", pontos: 4 },
      { label: "Não tive perdas financeiras", pontos: 5 },
    ],
  },
];

const STORAGE_KEY = "avb_esj_historico";

function getSemana(offset = 0): string {
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const d = new Date();
  d.setDate(d.getDate() - offset * 7);
  const [dd, mm, yyyy] = fmt.format(d).split("/");
  const localDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00-03:00`);
  const startOfYear = new Date(`${yyyy}-01-01T00:00:00-03:00`);
  const week = Math.ceil(
    ((localDate.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() + 1) / 7
  );
  return `Sem ${week}`;
}

function exportarHistorico(historico: Array<{ semana: string; pontuacao: number }>) {
  try {
    const blob = new Blob(
      [JSON.stringify({ exportadoEm: new Date().toISOString(), app: "AVB — Quando o Jogo Vira Problema", historico }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `escala-esj-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // fallback silencioso
  }
}

export default function EscalaESJ() {
  const [respostas, setRespostas] = useState<Record<string, number | null>>({
    e1: null, e2: null, e3: null,
  });
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [avisoFechado, setAvisoFechado] = useState(false);
  // FASE 1 — BUG-02: historico carregado via storage.ts (criptografado)
  const [historico, setHistorico] = useState<Array<{ semana: string; pontuacao: number }>>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    loadEncrypted<Array<{ semana: string; pontuacao: number }>>(STORAGE_KEY, []).then((dados) => {
      setHistorico(dados);
      setCarregando(false);
    });
  }, []);

  const responder = (id: string, pontos: number) => {
    setRespostas((prev) => ({ ...prev, [id]: pontos }));
  };

  const podeCalcular = Object.values(respostas).every((v) => v !== null);

  const calcular = async () => {
    const pontuacao = Object.values(respostas).reduce((s, v) => s + (v ?? 0), 0);
    const semana = getSemana();
    const novoHistorico = [
      ...historico.filter((h) => h.semana !== semana),
      { semana, pontuacao },
    ].slice(-8);

    // FASE 1 — BUG-02: salvar via storage.ts (criptografado)
    await saveEncrypted(STORAGE_KEY, novoHistorico);
    setHistorico(novoHistorico);
    setMostrarResultado(true);
  };

  const pontuacaoAtual = useMemo(
    () => Object.values(respostas).reduce((s, v) => s + (v ?? 0), 0),
    [respostas]
  );

  const pontuacaoAnterior =
    historico.length >= 2 ? historico[historico.length - 2]?.pontuacao ?? null : null;

  const subindo = pontuacaoAnterior !== null && pontuacaoAtual > pontuacaoAnterior;
  const dadosGrafico = historico.map((h) => ({ semana: h.semana, pontuacao: h.pontuacao }));

  if (carregando) {
    return (
      <div className="flex-1 container py-8 flex items-center justify-center">
        <p className="font-body text-muted-foreground text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <PageAudioWrapper pageText={AUDIO_TEXT} label="Ouvir sobre a Escala Semanal">
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
              <BarChart3 className="w-7 h-7 text-primary" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl">Escala Semanal do Jogo</h1>
            </div>
            <p className="font-body text-muted-foreground mb-6">
              As questões abaixo se referem aos <strong>últimos 7 dias</strong>.
            </p>
          </motion.div>

          {/* Aviso de dados locais */}
          {!avisoFechado && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-cordel p-4 mb-6 bg-[oklch(0.55_0.14_60/0.08)] border-[oklch(0.55_0.14_60)]"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[oklch(0.45_0.14_60)] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-body text-sm font-bold mb-1">
                    Seus dados ficam só neste dispositivo
                  </p>
                  <p className="font-body text-xs text-muted-foreground mb-3">
                    Se trocar de celular ou limpar o app, seu histórico será perdido.
                    Exporte regularmente para guardar sua evolução.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {historico.length > 0 && (
                      <button
                        onClick={() => exportarHistorico(historico)}
                        className="flex items-center gap-1 font-body text-xs font-bold px-3 py-1.5 bg-[oklch(0.55_0.14_60)] text-white rounded-md hover:bg-[oklch(0.45_0.14_60)] transition-colors"
                        aria-label="Exportar histórico de escalas como arquivo JSON"
                      >
                        <Download className="w-3 h-3" aria-hidden="true" />
                        Exportar histórico
                      </button>
                    )}
                    <button
                      onClick={() => setAvisoFechado(true)}
                      className="font-body text-xs text-muted-foreground hover:text-foreground px-2 py-1.5"
                      aria-label="Fechar aviso sobre dados locais"
                    >
                      Entendi, fechar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Gráfico de histórico */}
          {historico.length >= 2 && (
            <section aria-label="Gráfico de evolução semanal" className="card-cordel p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-sm font-bold">Sua evolução recente:</p>
                <button
                  onClick={() => exportarHistorico(historico)}
                  className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Exportar histórico como JSON"
                >
                  <Download className="w-3 h-3" aria-hidden="true" />
                  Exportar
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={dadosGrafico} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="semana" tick={{ fontSize: 10, fontFamily: "inherit" }} />
                  <YAxis domain={[0, 15]} tick={{ fontSize: 10, fontFamily: "inherit" }} />
                  <Tooltip
                    formatter={(v) => [`${v} pontos`, "Pontuação"]}
                    contentStyle={{ fontFamily: "inherit", fontSize: 12 }}
                  />
                  <ReferenceLine
                    y={11.5}
                    stroke="#B71C1C"
                    strokeDasharray="4 4"
                    label={{ value: "11,5", position: "right", fontSize: 10, fill: "#B71C1C" }}
                  />
                  <Bar dataKey="pontuacao" fill="oklch(0.45 0.12 250)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="font-body text-xs text-muted-foreground text-center mt-1">
                Linha vermelha = ponto de atenção (11,5). Quanto maior, menos comprometido.
              </p>
            </section>
          )}

          {historico.length === 0 && (
            <div className="card-cordel p-5 mb-6 text-center bg-[oklch(0.45_0.12_250/0.05)]">
              <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2 opacity-40" aria-hidden="true" />
              <p className="font-body text-sm text-muted-foreground">
                Preencha por <strong>2 semanas seguidas</strong> para ver seu gráfico de evolução aqui.
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                Esta é sua primeira semana — obrigado por começar. 🌱
              </p>
            </div>
          )}

          {historico.length === 1 && (
            <div className="card-cordel p-4 mb-6 bg-[oklch(0.45_0.12_250/0.05)]">
              <p className="font-body text-sm text-muted-foreground text-center">
                📈 Mais <strong>1 semana</strong> e seu gráfico de evolução estará disponível aqui.
              </p>
            </div>
          )}

          {!mostrarResultado ? (
            <div className="space-y-5">
              {questoes.map((q, idx) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-cordel p-5"
                >
                  <p className="font-body text-sm font-semibold mb-4 leading-relaxed">
                    {idx + 1}. {q.texto}
                  </p>
                  <div className="space-y-2" role="radiogroup" aria-label={q.texto}>
                    {q.opcoes.map((op) => (
                      <button
                        key={op.pontos}
                        onClick={() => responder(q.id, op.pontos)}
                        role="radio"
                        aria-checked={respostas[q.id] === op.pontos}
                        className={`w-full p-3 rounded-md border-2 text-left font-body text-sm transition-all min-h-[44px] ${
                          respostas[q.id] === op.pontos
                            ? "bg-primary text-primary-foreground border-primary shadow-[2px_2px_0_oklch(0.15_0.02_50)]"
                            : "border-foreground/20 hover:border-foreground/60"
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}

              <Button
                onClick={calcular}
                disabled={!podeCalcular}
                size="lg"
                className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" aria-hidden="true" />
                Calcular resultado
              </Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div
                className={`card-cordel p-6 mb-6 ${
                  pontuacaoAtual > 11.5
                    ? "bg-[oklch(0.50_0.14_155/0.08)] border-accent"
                    : "bg-[oklch(0.50_0.2_25/0.08)] border-destructive"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {pontuacaoAtual > 11.5 ? (
                    <TrendingUp className="w-6 h-6 text-accent" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-destructive" aria-hidden="true" />
                  )}
                  <div>
                    <p className="font-body font-bold text-lg">
                      Resultado: {pontuacaoAtual} / 15
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      Quanto maior, menor o comprometimento com o jogo.
                    </p>
                  </div>
                </div>

                {pontuacaoAtual > 11.5 ? (
                  <p className="font-body text-sm leading-relaxed">
                    ✅ <strong>Menos comprometido.</strong> Você está mantendo bom controle esta semana.
                  </p>
                ) : (
                  <p className="font-body text-sm leading-relaxed">
                    💙 <strong>Esta semana foi mais difícil.</strong> Isso faz parte do processo — não significa fracasso.
                    Busque sua rede de apoio e retome no seu ritmo.
                  </p>
                )}

                {pontuacaoAnterior !== null && (
                  <p className={`font-body text-xs mt-2 ${subindo ? "text-accent" : "text-muted-foreground"}`}>
                    {subindo
                      ? `📈 Melhorou ${pontuacaoAtual - pontuacaoAnterior} pontos em relação à semana anterior`
                      : `📉 Caiu ${(pontuacaoAnterior ?? 0) - pontuacaoAtual} pontos em relação à semana anterior`}
                  </p>
                )}
              </div>

              <p className="font-body text-xs text-center text-muted-foreground mb-4">
                Preencher toda semana ajuda a perceber padrões ao longo do tempo.
              </p>

              <Button
                onClick={() => {
                  setMostrarResultado(false);
                  setRespostas({ e1: null, e2: null, e3: null });
                }}
                variant="outline"
                className="w-full border-2 border-foreground font-body mb-3"
              >
                Preencher novamente
              </Button>

              <Link href="/" className="block text-center font-body text-sm text-primary underline">
                Voltar ao início
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </PageAudioWrapper>
  );
}
