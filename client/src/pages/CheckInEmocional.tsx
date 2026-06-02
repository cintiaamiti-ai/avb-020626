import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Heart, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { Button } from "@/components/ui/button";
import { saveEncrypted, loadEncrypted } from "@/lib/storage";
import { toast } from "sonner";

const CHECKIN_AUDIO_TEXT = `Check-in Emocional. Como você está se sentindo agora? Escolha uma opção que descreva seu estado atual. Tranquilo, Preocupado, Ansioso, Triste, ou Com vontade de jogar. Não há resposta certa ou errada. Este espaço é seu.`;

const STORAGE_KEY = "avb_checkin_historico";

type EstadoEmocional =
  | "tranquilo"
  | "preocupado"
  | "ansioso"
  | "triste"
  | "vontade_jogar";

interface EntradaCheckin {
  estado: EstadoEmocional;
  nota?: string;
  timestamp: number;
}

const opcoes: {
  valor: EstadoEmocional;
  label: string;
  descricao: string;
  cor: string;
  icone: string;
}[] = [
  {
    valor: "tranquilo",
    label: "Tranquilo",
    descricao: "Me sinto calmo e em paz",
    cor: "bg-[oklch(0.50_0.14_155/0.12)] border-[oklch(0.50_0.14_155)] text-[oklch(0.35_0.14_155)]",
    icone: "🌿",
  },
  {
    valor: "preocupado",
    label: "Preocupado",
    descricao: "Tenho pensamentos de alerta",
    cor: "bg-[oklch(0.55_0.14_60/0.12)] border-[oklch(0.55_0.14_60)] text-[oklch(0.40_0.14_60)]",
    icone: "☁️",
  },
  {
    valor: "ansioso",
    label: "Ansioso",
    descricao: "Sinto tensão ou inquietação",
    cor: "bg-[oklch(0.45_0.15_240/0.12)] border-[oklch(0.45_0.15_240)] text-[oklch(0.35_0.15_240)]",
    icone: "🌊",
  },
  {
    valor: "triste",
    label: "Triste",
    descricao: "Estou pesado ou para baixo",
    cor: "bg-[oklch(0.40_0.12_270/0.12)] border-[oklch(0.40_0.12_270)] text-[oklch(0.30_0.12_270)]",
    icone: "🌧️",
  },
  {
    valor: "vontade_jogar",
    label: "Com vontade de jogar",
    descricao: "Estou sentindo o impulso agora",
    cor: "bg-[oklch(0.50_0.2_25/0.12)] border-destructive text-destructive",
    icone: "🎯",
  },
];

function formatarData(timestamp: number): string {
  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function labelEstado(valor: EstadoEmocional): string {
  return opcoes.find((o) => o.valor === valor)?.label ?? valor;
}

export default function CheckInEmocional() {
  const [estadoSelecionado, setEstadoSelecionado] =
    useState<EstadoEmocional | null>(null);
  const [nota, setNota] = useState("");
  const [salvo, setSalvo] = useState(false);
  const [historico, setHistorico] = useState<EntradaCheckin[]>([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const dados = await loadEncrypted<EntradaCheckin[]>(STORAGE_KEY, []);
      setHistorico(dados);
      setCarregando(false);
    }
    carregar();
  }, []);

  const handleSalvar = async () => {
    if (!estadoSelecionado) return;

    const nova: EntradaCheckin = {
      estado: estadoSelecionado,
      nota: nota.trim() || undefined,
      timestamp: Date.now(),
    };

    const atualizado = [nova, ...historico].slice(0, 90); // Mantém últimos 90 registros
    await saveEncrypted(STORAGE_KEY, atualizado);
    setHistorico(atualizado);
    setSalvo(true);
    toast.success("Check-in registrado.", {
      description: "Seus dados ficam apenas no seu dispositivo.",
    });
  };

  const opcaoSelecionada = opcoes.find((o) => o.valor === estadoSelecionado);

  return (
    <PageAudioWrapper pageText={CHECKIN_AUDIO_TEXT} label="Ouvir check-in emocional">
      <div className="flex-1 container py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl mb-2">Check-in Emocional</h1>
            <p className="font-body text-muted-foreground mb-8">
              Como você está se sentindo agora? Não há resposta certa ou errada.
            </p>
          </motion.div>

          {/* Opções de estado */}
          {!salvo && (
            <div className="space-y-3 mb-6">
              {opcoes.map((opcao, i) => (
                <motion.button
                  key={opcao.valor}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => {
                    setEstadoSelecionado(opcao.valor);
                    setSalvo(false);
                  }}
                  aria-label={`Selecionar: ${opcao.label} — ${opcao.descricao}`}
                  aria-pressed={estadoSelecionado === opcao.valor}
                  className={`w-full text-left p-4 rounded-md border-2 transition-all min-h-[56px] font-body ${
                    estadoSelecionado === opcao.valor
                      ? opcao.cor + " shadow-[3px_3px_0_oklch(0.15_0.02_50)]"
                      : "border-foreground/20 hover:border-foreground/50 hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden="true">
                      {opcao.icone}
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{opcao.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {opcao.descricao}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Campo de nota opcional */}
          <AnimatePresence>
            {estadoSelecionado && !salvo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <label
                  htmlFor="nota-checkin"
                  className="block font-body text-sm font-medium mb-2"
                >
                  Quer adicionar algo? (opcional)
                </label>
                <textarea
                  id="nota-checkin"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Escreva o que quiser — só você vai ler..."
                  rows={3}
                  maxLength={300}
                  className="w-full p-3 font-body text-sm border-2 border-foreground rounded-md bg-background resize-none focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
                <p className="font-body text-xs text-muted-foreground text-right mt-1">
                  {nota.length}/300
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Aviso se escolheu vontade de jogar */}
          <AnimatePresence>
            {estadoSelecionado === "vontade_jogar" && !salvo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card-cordel p-4 mb-6 bg-[oklch(0.50_0.2_25/0.08)] border-destructive"
              >
                <p className="font-body text-sm text-foreground">
                  Reconhecer o impulso é um passo importante. Se precisar de ajuda
                  agora:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <Link
                    href="/sos"
                    className="flex-1 text-center px-4 py-2 bg-destructive text-destructive-foreground font-body font-bold text-sm rounded-md border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] hover:opacity-90 transition-opacity"
                  >
                    Ir para o SOS
                  </Link>
                  <Link
                    href="/crise"
                    className="flex-1 text-center px-4 py-2 bg-background text-foreground font-body font-bold text-sm rounded-md border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] hover:bg-muted transition-colors"
                  >
                    Modo Crise
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão salvar */}
          {!salvo && estadoSelecionado && (
            <Button
              onClick={handleSalvar}
              size="lg"
              className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2 mb-6"
            >
              <Heart className="w-5 h-5" />
              Registrar como estou
            </Button>
          )}

          {/* Feedback pós-save */}
          <AnimatePresence>
            {salvo && opcaoSelecionada && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-cordel p-6 mb-6 bg-[oklch(0.50_0.14_155/0.08)] border-accent text-center"
              >
                <span className="text-4xl block mb-3" aria-hidden="true">
                  {opcaoSelecionada.icone}
                </span>
                <p className="font-body font-semibold text-foreground">
                  Check-in registrado.
                </p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Obrigado por se dar esse momento de atenção.
                </p>
                <button
                  onClick={() => {
                    setEstadoSelecionado(null);
                    setNota("");
                    setSalvo(false);
                  }}
                  className="mt-4 font-body text-sm text-primary underline hover:text-primary/80"
                >
                  Fazer outro check-in
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Histórico */}
          {!carregando && historico.length > 0 && (
            <div className="card-cordel p-5">
              <button
                onClick={() => setMostrarHistorico((v) => !v)}
                className="w-full flex items-center justify-between font-body font-semibold text-sm"
                aria-expanded={mostrarHistorico}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Histórico ({historico.length} registros)
                </span>
                {mostrarHistorico ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {mostrarHistorico && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1"
                  >
                    {historico.map((entrada, i) => {
                      const opcao = opcoes.find(
                        (o) => o.valor === entrada.estado
                      );
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-muted rounded-md"
                        >
                          <span className="text-lg shrink-0" aria-hidden="true">
                            {opcao?.icone ?? "•"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-semibold">
                              {labelEstado(entrada.estado)}
                            </p>
                            {entrada.nota && (
                              <p className="font-body text-xs text-muted-foreground mt-0.5 truncate">
                                {entrada.nota}
                              </p>
                            )}
                            <p className="font-body text-xs text-muted-foreground mt-0.5">
                              {formatarData(entrada.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Privacidade */}
          <p className="font-body text-xs text-muted-foreground text-center mt-6">
            Seus dados ficam apenas no seu dispositivo. Ninguém mais tem acesso.
          </p>
        </div>
      </div>
    </PageAudioWrapper>
  );
}
