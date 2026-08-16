import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, RotateCcw, Heart, Phone,
  Wind, Eye, Users, WifiOff, Shield, CheckCircle, AlertTriangle,
} from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import HealthyExit from "@/components/HealthyExit";

const SOS_AUDIO_TEXT = `Botão SOS. A onda de impulso dura em média 15 minutos. Aguente firme, ela vai passar. Primeiro: ative o modo avião do seu celular para cortar o acesso a sites de apostas. Depois pressione Iniciar para começar o cronômetro. Enquanto espera, respire fundo. Se precisar falar com alguém agora: CVV, ligue 188, gratuito, 24 horas, sigiloso. Jogadores Anônimos, ligue 11, 3229-1615.`;

const TOTAL_SECONDS = 15 * 60;

const dicasImpulso = [
  "Respire fundo. Inspire por 4 segundos, segure por 4, solte por 4.",
  "Beba um copo de água devagar. Sinta a temperatura.",
  "Olhe ao redor. Nomeie 5 coisas que você vê.",
  "Ligue para alguém de confiança. Só ouvir uma voz ajuda.",
  "Saia do lugar onde está. Mude de ambiente, nem que seja por 5 minutos.",
  "Lembre-se: essa onda de impulso vai passar em 15 minutos.",
  "Pense em algo que o dinheiro da aposta poderia pagar: uma conta, um presente, comida.",
  "Coloque uma música que te acalma. Feche os olhos e ouça.",
];

export default function SOS() {
  const [tempoRestante, setTempoRestante] = useState(TOTAL_SECONDS);
  const [ativo, setAtivo] = useState(false);
  const [dicaAtual, setDicaAtual] = useState(0);
  const [modoAviaoAtivado, setModoAviaoAtivado] = useState(false);
  // C-02: estado para erro de modo avião
  const [aviaoErro, setAviaoErro] = useState(false);
  // C-03: estado para timer concluído
  const [timerConcluido, setTimerConcluido] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { state } = useApp();

  useEffect(() => {
    if (ativo && tempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTempoRestante((t) => t - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ativo, tempoRestante]);

  // C-03: detectar fim do timer e dar feedback sensorial
  useEffect(() => {
    if (tempoRestante === 0 && ativo) {
      setAtivo(false);
      setTimerConcluido(true);

      // Vibração mobile
      if (navigator.vibrate) {
        navigator.vibrate([600, 200, 600, 200, 600]);
      }

      // Beep via Web Audio API
      try {
        const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          [0, 0.4, 0.8].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.3);
          });
        }
      } catch {
        // Web Audio não disponível — silencioso
      }
    }
  }, [tempoRestante, ativo]);

  useEffect(() => {
    if (ativo) {
      const tipInterval = setInterval(() => {
        setDicaAtual((d) => (d + 1) % dicasImpulso.length);
      }, 30000);
      return () => clearInterval(tipInterval);
    }
  }, [ativo]);

  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;
  const progresso = ((TOTAL_SECONDS - tempoRestante) / TOTAL_SECONDS) * 100;

  const iniciar = () => {
    setAtivo(true);
    setTimerConcluido(false);
    if (tempoRestante === 0) setTempoRestante(TOTAL_SECONDS);
  };
  const pausar = () => setAtivo(false);
  const reiniciar = () => {
    setAtivo(false);
    setTempoRestante(TOTAL_SECONDS);
    setDicaAtual(0);
    setTimerConcluido(false);
  };

  // C-02: validar navigator.onLine antes de confirmar modo avião
  const confirmarModoAviao = () => {
    if (!modoAviaoAtivado && navigator.onLine) {
      setAviaoErro(true);
      setTimeout(() => setAviaoErro(false), 5000);
      return;
    }
    setAviaoErro(false);
    setModoAviaoAtivado(!modoAviaoAtivado);
  };

  const motivosDoUsuario = state.motivosNaoJogar?.filter((m) => m.trim().length > 0) || [];

  return (
    <PageAudioWrapper pageText={SOS_AUDIO_TEXT} label="Ouvir instruções SOS">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">Botão SOS</h1>
          <p className="font-body text-muted-foreground mb-4">
            A onda de impulso dura em média <strong className="text-foreground">15 minutos</strong>.
            Aguente firme — ela vai passar.
          </p>
        </motion.div>

        {/* MODO AVIÃO — C-01: tokens oklch + C-02: validação online */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`card-cordel p-5 mb-6 ${
            modoAviaoAtivado
              ? "bg-[oklch(0.50_0.14_155/0.08)] border-accent"
              : "bg-[oklch(0.55_0.14_60/0.08)] border-[oklch(0.55_0.14_60)]"
          }`}
        >
          <div className="flex items-start gap-3">
            <WifiOff className={`w-6 h-6 shrink-0 mt-0.5 ${modoAviaoAtivado ? "text-accent" : "text-[oklch(0.45_0.14_60)]"}`} />
            <div className="flex-1">
              <h3 className="text-base font-bold mb-1">
                {modoAviaoAtivado ? "✓ Modo Avião Ativado" : "Passo 1: Ative o Modo Avião"}
              </h3>
              <p className="font-body text-sm text-foreground mb-3">
                {modoAviaoAtivado
                  ? "Ótimo! Sem internet, você não consegue acessar sites de apostas. Agora inicie o cronômetro."
                  : "Ative o modo avião do celular para cortar o acesso a sites de apostas. Depois confirme abaixo."}
              </p>

              {/* C-02: aviso quando ainda online */}
              {aviaoErro && (
                <div className="p-3 mb-3 rounded-md bg-[oklch(0.50_0.2_25/0.10)] border border-destructive">
                  <p className="font-body text-sm text-destructive font-semibold">
                    ⚠️ Você ainda está conectado à internet. Ative o modo avião primeiro.
                  </p>
                </div>
              )}

              <button
                onClick={confirmarModoAviao}
                aria-label={modoAviaoAtivado ? "Modo avião confirmado" : "Confirmar ativação do modo avião"}
                className={`px-4 py-2 rounded-lg font-body font-bold text-sm border-2 transition-all min-h-[44px] ${
                  modoAviaoAtivado
                    ? "bg-[oklch(0.45_0.14_155)] text-white border-accent"
                    : "bg-[oklch(0.55_0.14_60)] text-white border-[oklch(0.45_0.14_60)] hover:bg-[oklch(0.45_0.14_60)]"
                }`}
              >
                {modoAviaoAtivado ? "✓ Confirmado" : "Já ativei o modo avião"}
              </button>

              {/* C-04: aviso contradição modo avião + ligar */}
              {modoAviaoAtivado && (
                <p className="font-body text-xs text-muted-foreground mt-2">
                  ✈️ Para ligar ao CVV: desative o modo avião brevemente, ligue 188, depois reative.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* C-03: Banner de conclusão do timer */}
        {timerConcluido && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-cordel p-5 mb-6 bg-[oklch(0.50_0.14_155/0.10)] border-accent"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-accent shrink-0" />
              <div>
                <p className="font-body font-bold text-lg text-accent">
                  Você resistiu! 🎉 15 minutos concluídos.
                </p>
                <p className="font-body text-sm mt-1">
                  O impulso passou. Você tem força. Continue com sua rede de apoio.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Timer Circle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-cordel p-8 text-center mb-6"
        >
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.92 0.02 75)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={tempoRestante === 0 ? "oklch(0.50 0.14 155)" : "oklch(0.50 0.2 25)"}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progresso / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-body tabular-nums">
                {String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")}
              </span>
              <span className="text-xs font-body text-muted-foreground mt-1">
                {tempoRestante === 0 ? "Concluído!" : "restantes"}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!ativo ? (
              <Button
                onClick={iniciar}
                size="lg"
                aria-label={tempoRestante === TOTAL_SECONDS ? "Iniciar cronômetro de 15 minutos" : "Continuar cronômetro"}
                className="bg-[oklch(0.50_0.14_155)] text-white border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
              >
                <Play className="w-5 h-5" />
                {tempoRestante === TOTAL_SECONDS ? "Iniciar" : "Continuar"}
              </Button>
            ) : (
              <Button
                onClick={pausar}
                size="lg"
                variant="outline"
                aria-label="Pausar cronômetro"
                className="border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </Button>
            )}
            <Button
              onClick={reiniciar}
              size="lg"
              variant="outline"
              aria-label="Reiniciar cronômetro"
              className="border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </Button>
          </div>
        </motion.div>

        {/* Motivos pessoais */}
        {motivosDoUsuario.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-cordel p-5 bg-[oklch(0.50_0.14_155/0.05)] border-accent mb-6"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm font-bold text-foreground mb-2">
                  Lembre-se por que você escolheu parar:
                </p>
                <ul className="space-y-1">
                  {motivosDoUsuario.map((motivo, i) => (
                    <li key={i} className="font-body text-sm text-foreground flex items-start gap-2">
                      <span className="text-accent font-bold">•</span>
                      {motivo}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dica atual */}
        <motion.div
          key={dicaAtual}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-cordel p-6 bg-[oklch(0.45_0.15_240/0.05)] mb-6"
        >
          <div className="flex gap-3">
            <Heart className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-foreground mb-1">Dica para agora:</p>
              <p className="font-body text-foreground">{dicasImpulso[dicaAtual]}</p>
            </div>
          </div>
        </motion.div>

        {/* Técnicas rápidas */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/exercicio/7" className="block">
            <div className="card-cordel p-4 text-center h-full flex flex-col items-center justify-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              <span className="font-body text-sm font-semibold">Técnica 5-4-3-2-1</span>
            </div>
          </Link>
          <Link href="/exercicio/8" className="block">
            <div className="card-cordel p-4 text-center h-full flex flex-col items-center justify-center gap-2">
              <Wind className="w-6 h-6 text-accent" />
              <span className="font-body text-sm font-semibold">Respiração Quadrada</span>
            </div>
          </Link>
        </div>

        {/* Contatos de emergência — C-04: aviso quando modo avião ativo */}
        <div className="card-cordel p-5 bg-[oklch(0.50_0.2_25/0.05)] border-destructive mb-6">
          <h3 className="text-base mb-3 text-center">Precisa falar com alguém agora?</h3>

          {modoAviaoAtivado && (
            <div className="flex items-start gap-2 p-3 mb-3 rounded-md bg-[oklch(0.55_0.14_60/0.08)] border border-[oklch(0.55_0.14_60)]">
              <AlertTriangle className="w-4 h-4 text-[oklch(0.45_0.14_60)] shrink-0 mt-0.5" />
              <p className="font-body text-xs text-[oklch(0.35_0.14_60)] font-semibold">
                ✈️ Modo avião ativo — desative-o brevemente para ligar ao CVV 188, depois reative.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <a
              href="tel:188"
              className="flex items-center gap-3 p-3 bg-background rounded-md border border-foreground/20 hover:bg-muted transition-colors"
              aria-label="Ligar para o CVV no número 188"
            >
              <Phone className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-body font-bold text-sm">CVV — 188</p>
                <p className="font-body text-xs text-muted-foreground">Apoio emocional 24h · Gratuito · Sigiloso</p>
              </div>
            </a>
            <a
              href="tel:+551132291615"
              className="flex items-center gap-3 p-3 bg-background rounded-md border border-foreground/20 hover:bg-muted transition-colors"
              aria-label="Ligar para Jogadores Anônimos no número 11 3229-1615"
            >
              <Users className="w-5 h-5 text-accent" />
              <div>
                <p className="font-body font-bold text-sm">Jogadores Anônimos — (11) 3229-1615</p>
                <p className="font-body text-xs text-muted-foreground">Grupo de apoio · Gratuito · Sigiloso</p>
              </div>
            </a>
          </div>
        </div>

        {motivosDoUsuario.length === 0 && (
          <div className="text-center mb-6">
            <Link href="/balanca-decisoria" className="font-body text-sm text-primary underline hover:text-primary/80">
              Cadastre seus motivos para não jogar na Balança Decisória
            </Link>
          </div>
        )}

        {/* FASE 3 — UX-02: HealthyExit ao concluir os 15 minutos do SOS */}
        {timerConcluido && <HealthyExit contexto="sos" />}
      </div>
    </div>
    </PageAudioWrapper>
  );
}
