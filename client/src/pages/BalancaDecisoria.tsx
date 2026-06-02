import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Scale, Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import HealthyExit from "@/components/HealthyExit";

const AUDIO_TEXT = `Balança Decisória. Neste exercício, você vai listar os motivos para continuar jogando e os motivos para parar. Isso ajuda a visualizar com clareza o que você ganha e o que perde com o jogo. Seus motivos para não jogar ficarão salvos e aparecerão no Botão SOS quando você precisar de força.`;

export default function BalancaDecisoria() {
  const { state, salvarMotivosNaoJogar } = useApp();
  const [motivosJogar, setMotivosJogar] = useState<string[]>(["", ""]);
  const [motivosNaoJogar, setMotivosNaoJogar] = useState<string[]>(
    state.motivosNaoJogar?.length > 0 ? state.motivosNaoJogar : ["", ""]
  );
  const [salvo, setSalvo] = useState(false);
  // FASE 1 — BUG-01: useRef para cleanup do setTimeout
  const salvoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FASE 1 — BUG-01: cleanup no unmount
  useEffect(() => {
    return () => {
      if (salvoTimerRef.current) clearTimeout(salvoTimerRef.current);
    };
  }, []);

  const addMotivo = (tipo: "jogar" | "naoJogar") => {
    if (tipo === "jogar") setMotivosJogar([...motivosJogar, ""]);
    else setMotivosNaoJogar([...motivosNaoJogar, ""]);
  };

  const removeMotivo = (tipo: "jogar" | "naoJogar", index: number) => {
    if (tipo === "jogar") setMotivosJogar(motivosJogar.filter((_, i) => i !== index));
    else setMotivosNaoJogar(motivosNaoJogar.filter((_, i) => i !== index));
  };

  const updateMotivo = (tipo: "jogar" | "naoJogar", index: number, value: string) => {
    if (tipo === "jogar") {
      const novo = [...motivosJogar];
      novo[index] = value;
      setMotivosJogar(novo);
    } else {
      const novo = [...motivosNaoJogar];
      novo[index] = value;
      setMotivosNaoJogar(novo);
    }
  };

  const salvar = () => {
    const motivosValidos = motivosNaoJogar.filter((m) => m.trim().length > 0);
    salvarMotivosNaoJogar(motivosValidos);
    setSalvo(true);
    // FASE 1 — BUG-01: limpar timer anterior antes de criar novo
    if (salvoTimerRef.current) clearTimeout(salvoTimerRef.current);
    salvoTimerRef.current = setTimeout(() => setSalvo(false), 3000);
  };

  const totalJogar = motivosJogar.filter((m) => m.trim().length > 0).length;
  const totalNaoJogar = motivosNaoJogar.filter((m) => m.trim().length > 0).length;

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
              <Scale className="w-7 h-7 text-primary" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl">Balança Decisória</h1>
            </div>
            <p className="font-body text-muted-foreground mb-6">
              Liste os motivos para jogar e para não jogar. Visualize com clareza o que você ganha e o que perde.
              <br />
              <strong className="text-foreground">Seus motivos para não jogar aparecerão no Botão SOS.</strong>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Motivos para jogar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card-cordel p-5 bg-[oklch(0.50_0.2_25/0.05)] border-destructive"
            >
              <h3 className="text-base font-bold mb-1 text-destructive">Motivos para jogar</h3>
              <p className="font-body text-xs text-muted-foreground mb-4">
                O que te leva a jogar? (seja honesto)
              </p>
              <div className="space-y-3">
                {motivosJogar.map((motivo, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={motivo}
                      onChange={(e) => updateMotivo("jogar", i, e.target.value)}
                      placeholder={`Motivo ${i + 1}...`}
                      aria-label={`Motivo para jogar ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-foreground/20 bg-background font-body text-sm focus:border-destructive focus:outline-none transition-colors min-h-[44px]"
                    />
                    {motivosJogar.length > 1 && (
                      <button
                        onClick={() => removeMotivo("jogar", i)}
                        className="w-9 h-9 rounded-lg border-2 border-foreground/20 flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Remover motivo para jogar ${i + 1}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addMotivo("jogar")}
                className="mt-3 flex items-center gap-2 font-body text-sm text-destructive hover:underline"
                aria-label="Adicionar motivo para jogar"
              >
                <Plus size={14} aria-hidden="true" /> Adicionar motivo
              </button>
              <div className="mt-4 text-center">
                <span className="font-body text-2xl font-bold text-destructive">{totalJogar}</span>
                <span className="font-body text-xs text-muted-foreground block">motivos</span>
              </div>
            </motion.div>

            {/* Motivos para NÃO jogar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-cordel p-5 bg-[oklch(0.50_0.14_155/0.05)] border-accent"
            >
              <h3 className="text-base font-bold mb-1 text-accent">Motivos para NÃO jogar</h3>
              <p className="font-body text-xs text-muted-foreground mb-4">
                O que você ganha ao parar? (esses aparecem no SOS)
              </p>
              <div className="space-y-3">
                {motivosNaoJogar.map((motivo, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={motivo}
                      onChange={(e) => updateMotivo("naoJogar", i, e.target.value)}
                      placeholder={`Motivo ${i + 1}...`}
                      aria-label={`Motivo para não jogar ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-foreground/20 bg-background font-body text-sm focus:border-accent focus:outline-none transition-colors min-h-[44px]"
                    />
                    {motivosNaoJogar.length > 1 && (
                      <button
                        onClick={() => removeMotivo("naoJogar", i)}
                        className="w-9 h-9 rounded-lg border-2 border-foreground/20 flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Remover motivo para não jogar ${i + 1}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addMotivo("naoJogar")}
                className="mt-3 flex items-center gap-2 font-body text-sm text-accent hover:underline"
                aria-label="Adicionar motivo para não jogar"
              >
                <Plus size={14} aria-hidden="true" /> Adicionar motivo
              </button>
              <div className="mt-4 text-center">
                <span className="font-body text-2xl font-bold text-accent">{totalNaoJogar}</span>
                <span className="font-body text-xs text-muted-foreground block">motivos</span>
              </div>
            </motion.div>
          </div>

          {/* Visual balance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-cordel p-6 mb-6"
          >
            <h3 className="text-base font-bold text-center mb-4">Sua Balança</h3>
            <div className="flex items-end justify-center gap-8" role="img" aria-label={`Balança: ${totalJogar} motivos para jogar, ${totalNaoJogar} motivos para não jogar`}>
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-destructive/20 border-2 border-destructive rounded-t-lg transition-all duration-500"
                  style={{ height: `${Math.max(20, totalJogar * 30)}px` }}
                />
                <span className="font-body text-xs mt-2 text-destructive font-bold">Jogar</span>
              </div>
              <Scale className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-accent/20 border-2 border-accent rounded-t-lg transition-all duration-500"
                  style={{ height: `${Math.max(20, totalNaoJogar * 30)}px` }}
                />
                <span className="font-body text-xs mt-2 text-accent font-bold">Não jogar</span>
              </div>
            </div>
            {totalNaoJogar > totalJogar && (
              <p className="font-body text-sm text-center mt-4 text-accent font-semibold">
                Você tem mais motivos para não jogar. Use isso como força!
              </p>
            )}
          </motion.div>

          {/* Save button */}
          <div className="flex justify-center">
            <Button
              onClick={salvar}
              size="lg"
              className={`font-body font-bold gap-2 border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] transition-all ${
                salvo ? "bg-accent text-white" : "bg-primary text-primary-foreground"
              }`}
            >
              {salvo ? (
                <>
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                  Salvo! Aparecerá no SOS
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" aria-hidden="true" />
                  Salvar motivos para o SOS
                </>
              )}
            </Button>
          </div>

          {/* FASE 3 — UX-02: HealthyExit após salvar */}
          {salvo && <HealthyExit contexto="exercicio" />}
        </div>
      </div>
    </PageAudioWrapper>
  );
}
