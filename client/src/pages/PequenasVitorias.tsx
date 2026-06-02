import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { saveEncrypted, loadEncrypted } from "@/lib/storage";
import { toast } from "sonner";

const VITORIAS_AUDIO_TEXT = `Pequenas Vitórias. Sua vida além do jogo. Aqui você pode registrar coisas que fez hoje que não envolvem apostar. Caminhei, cozinhei, trabalhei, conversei com alguém, dormi melhor. Cada ação conta. Não há pontuação, apenas reconhecimento do que você está construindo.`;

const STORAGE_KEY = "avb_pequenas_vitorias";

interface Vitoria {
  id: string;
  categoria: string;
  descricao?: string;
  timestamp: number;
}

const CATEGORIAS = [
  { valor: "caminhei", label: "Caminhei", icone: "🚶", descricao: "Dei uma caminhada" },
  { valor: "cozinhei", label: "Cozinhei", icone: "🍳", descricao: "Preparei uma refeição" },
  { valor: "trabalhei", label: "Trabalhei", icone: "💼", descricao: "Fiz algo produtivo" },
  { valor: "conversei", label: "Conversei com alguém", icone: "💬", descricao: "Tive uma troca com alguém" },
  { valor: "dormi", label: "Dormi melhor", icone: "😴", descricao: "Tive um bom descanso" },
  { valor: "cuidei", label: "Cuidei de mim", icone: "🧘", descricao: "Me dediquei ao meu bem-estar" },
  { valor: "lembrei", label: "Pedi ajuda", icone: "🤝", descricao: "Busquei apoio quando precisei" },
  { valor: "outro", label: "Outra conquista", icone: "⭐", descricao: "Algo que me orgulha hoje" },
];

function formatarData(timestamp: number): string {
  const agora = Date.now();
  const diff = agora - timestamp;
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);

  if (minutos < 2) return "agora mesmo";
  if (minutos < 60) return `há ${minutos} min`;
  if (horas < 24) return `há ${horas}h`;
  if (dias === 1) return "ontem";
  if (dias < 7) return `há ${dias} dias`;
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function labelCategoria(valor: string) {
  return CATEGORIAS.find((c) => c.valor === valor)?.label ?? valor;
}

function iconeCategoria(valor: string) {
  return CATEGORIAS.find((c) => c.valor === valor)?.icone ?? "⭐";
}

export default function PequenasVitorias() {
  const [vitorias, setVitorias] = useState<Vitoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const dados = await loadEncrypted<Vitoria[]>(STORAGE_KEY, []);
      setVitorias(dados);
      setCarregando(false);
    }
    carregar();
  }, []);

  const handleRegistrar = async () => {
    if (!categoriaSelecionada) return;

    const nova: Vitoria = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      categoria: categoriaSelecionada,
      descricao: descricao.trim() || undefined,
      timestamp: Date.now(),
    };

    const atualizado = [nova, ...vitorias].slice(0, 200);
    await saveEncrypted(STORAGE_KEY, atualizado);
    setVitorias(atualizado);
    setRegistroSalvo(true);
    setMostrarFormulario(false);
    toast.success("Registrado!", {
      description: "Cada passo conta.",
    });

    setTimeout(() => setRegistroSalvo(false), 4000);
  };

  const iniciarNovo = () => {
    setCategoriaSelecionada(null);
    setDescricao("");
    setMostrarFormulario(true);
    setRegistroSalvo(false);
  };

  // Agrupa vitórias por data para exibição
  const hoje = new Date().toDateString();
  const vitoriasHoje = vitorias.filter(
    (v) => new Date(v.timestamp).toDateString() === hoje
  );

  return (
    <PageAudioWrapper pageText={VITORIAS_AUDIO_TEXT} label="Ouvir pequenas vitórias">
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
            <h1 className="text-2xl sm:text-3xl mb-2">Pequenas Vitórias</h1>
            <p className="font-body text-muted-foreground mb-8">
              Sua vida além do jogo. Registre o que você fez hoje que vale a pena
              reconhecer.
            </p>
          </motion.div>

          {/* Vitórias de hoje */}
          {!carregando && vitoriasHoje.length > 0 && !mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-cordel p-5 mb-6 bg-[oklch(0.50_0.14_155/0.07)] border-accent/40"
            >
              <p className="font-body text-sm font-semibold text-foreground mb-3">
                Hoje você registrou:
              </p>
              <div className="flex flex-wrap gap-2">
                {vitoriasHoje.map((v) => (
                  <span
                    key={v.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-full border border-foreground/20 font-body text-sm"
                  >
                    <span aria-hidden="true">{iconeCategoria(v.categoria)}</span>
                    {labelCategoria(v.categoria)}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Feedback de registro recente */}
          <AnimatePresence>
            {registroSalvo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="card-cordel p-5 mb-6 text-center bg-[oklch(0.50_0.14_155/0.07)] border-accent/40"
              >
                <Check className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-body font-semibold">Registrado.</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Isso conta. Cada passo fora do jogo é um passo em direção a você
                  mesmo.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário de novo registro */}
          <AnimatePresence>
            {mostrarFormulario && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card-cordel p-5 mb-6"
              >
                <h2 className="text-base font-semibold mb-4">
                  O que você fez hoje?
                </h2>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat.valor}
                      onClick={() => setCategoriaSelecionada(cat.valor)}
                      aria-pressed={categoriaSelecionada === cat.valor}
                      aria-label={cat.label}
                      className={`p-3 text-left rounded-md border-2 transition-all font-body text-sm ${
                        categoriaSelecionada === cat.valor
                          ? "border-accent bg-[oklch(0.50_0.14_155/0.10)] shadow-[2px_2px_0_oklch(0.15_0.02_50)]"
                          : "border-foreground/20 hover:border-foreground/40 hover:bg-muted"
                      }`}
                    >
                      <span className="text-xl block mb-1" aria-hidden="true">
                        {cat.icone}
                      </span>
                      <span className="font-medium text-xs">{cat.label}</span>
                    </button>
                  ))}
                </div>

                {categoriaSelecionada && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-4"
                  >
                    <label
                      htmlFor="desc-vitoria"
                      className="block font-body text-sm font-medium mb-2"
                    >
                      Quer contar mais? (opcional)
                    </label>
                    <textarea
                      id="desc-vitoria"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Escreva o que quiser sobre isso..."
                      rows={2}
                      maxLength={200}
                      className="w-full p-3 font-body text-sm border-2 border-foreground rounded-md bg-background resize-none focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    />
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleRegistrar}
                    disabled={!categoriaSelecionada}
                    className="flex-1 border-2 border-foreground shadow-[2px_2px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Registrar
                  </Button>
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="px-4 py-2 font-body text-sm border-2 border-foreground/30 rounded-md hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão principal */}
          {!mostrarFormulario && (
            <Button
              onClick={iniciarNovo}
              size="lg"
              className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2 mb-8"
            >
              <Plus className="w-5 h-5" />
              Registrar uma conquista
            </Button>
          )}

          {/* Histórico */}
          {!carregando && vitorias.length > 0 && (
            <div className="card-cordel p-5">
              <button
                onClick={() => setMostrarHistorico((v) => !v)}
                className="w-full flex items-center justify-between font-body font-semibold text-sm"
                aria-expanded={mostrarHistorico}
              >
                <span className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                  Histórico ({vitorias.length} registros)
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
                    className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1"
                  >
                    {vitorias.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-start gap-3 p-3 bg-muted rounded-md"
                      >
                        <span className="text-xl shrink-0" aria-hidden="true">
                          {iconeCategoria(v.categoria)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-semibold">
                            {labelCategoria(v.categoria)}
                          </p>
                          {v.descricao && (
                            <p className="font-body text-xs text-muted-foreground mt-0.5">
                              {v.descricao}
                            </p>
                          )}
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            {formatarData(v.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!carregando && vitorias.length === 0 && !mostrarFormulario && (
            <div className="text-center p-8 text-muted-foreground font-body text-sm">
              Seus registros aparecem aqui.
              <br />
              Tudo o que você fizer conta.
            </div>
          )}

          <p className="font-body text-xs text-muted-foreground text-center mt-6">
            Dados salvos apenas no seu dispositivo.
          </p>
        </div>
      </div>
    </PageAudioWrapper>
  );
}
