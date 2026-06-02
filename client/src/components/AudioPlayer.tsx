/**
 * Componente AudioPlayer - Botão flutuante de áudio
 * Invisível durante atividades (exercícios, SOS, TCC)
 * Controles de velocidade com emojis
 */
import { useState } from "react";
import { Volume2, VolumeX, Pause, Play, Square } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPlayerProps {
  /** Texto que será lido em voz alta */
  text: string;
  /** Label para acessibilidade */
  label?: string;
}

export function AudioPlayer({ text, label = "Ouvir esta página" }: AudioPlayerProps) {
  const [location] = useLocation();
  const { speechRate } = useAccessibility();
  const { speak, stop, pause, resume, isSpeaking, isPaused, isSupported, rate, setRate } =
    useSpeech({ externalRate: speechRate });
  const [showControls, setShowControls] = useState(false);

  const emAtividade =
    location.startsWith("/exercicio") ||
    location === "/sos" ||
    location === "/tcc-mindfulness";

  if (!isSupported) return null;

  const handlePlay = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(text);
      setShowControls(true);
    }
  };

  const handleStop = () => {
    stop();
    setShowControls(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showControls && isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-gray-900 text-white rounded-2xl p-3 shadow-xl border-2 border-white/20 flex flex-col gap-2 min-w-[180px]"
          >
            {/* Controles de velocidade com emojis */}
            <div className="flex items-center justify-between gap-2 px-1">
              <button
                onClick={() => setRate(Math.max(0.5, rate - 0.25))}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-base font-bold"
                aria-label="Voz mais devagar"
              >
                −
              </button>
              <span className="text-xs font-bold text-center">
                {rate <= 0.75
                  ? "🐢 Devagar"
                  : rate <= 1.0
                  ? "🚶 Normal"
                  : rate <= 1.5
                  ? "🚴 Rápido"
                  : "🏃 Muito rápido"}
              </span>
              <button
                onClick={() => setRate(Math.min(2, rate + 0.25))}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-base font-bold"
                aria-label="Voz mais rápida"
              >
                +
              </button>
            </div>

            {/* Botão parar */}
            <button
              onClick={handleStop}
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-bold transition-colors"
              aria-label="Parar leitura"
            >
              <Square size={14} fill="currentColor" />
              Parar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão principal */}
      <button
        onClick={handlePlay}
        className={`rounded-full shadow-xl flex items-center justify-center border-2 transition-all duration-300 active:scale-95 ${
          isSpeaking
            ? isPaused
              ? "w-14 h-14 bg-yellow-500 border-yellow-700 text-white opacity-100"
              : "w-14 h-14 bg-green-600 border-green-800 text-white animate-pulse opacity-100"
            : emAtividade
            ? "w-8 h-8 bg-blue-700 border-blue-900 text-white opacity-20 hover:opacity-90"
            : "w-14 h-14 bg-blue-700 border-blue-900 text-white hover:bg-blue-800 opacity-80 hover:opacity-100"
        }`}
        aria-label={
          isSpeaking
            ? isPaused
              ? "Retomar leitura"
              : "Pausar leitura"
            : label
        }
        title={
          isSpeaking
            ? isPaused
              ? "Retomar leitura"
              : "Pausar leitura"
            : label
        }
      >
        {isSpeaking ? (
          isPaused ? (
            <Play size={isSpeaking || !emAtividade ? 28 : 14} fill="currentColor" />
          ) : (
            <Pause size={isSpeaking || !emAtividade ? 28 : 14} />
          )
        ) : (
          <Volume2 size={isSpeaking || !emAtividade ? 28 : 14} />
        )}
      </button>

      {/* Label "Ouvir" apenas fora de atividades */}
      {!isSpeaking && !emAtividade && (
        <span className="text-xs font-bold text-gray-700 bg-white/90 px-2 py-1 rounded-lg shadow-sm border border-gray-200 max-w-[80px] text-center leading-tight">
          Ouvir
        </span>
      )}
    </div>
  );
}

/**
 * Componente inline para ouvir um trecho específico
 */
interface AudioButtonInlineProps {
  text: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function AudioButtonInline({
  text,
  label = "Ouvir",
  size = "md",
}: AudioButtonInlineProps) {
  const { speechRate } = useAccessibility();
  const { speak, stop, isSpeaking, isSupported } = useSpeech({ externalRate: speechRate });

  if (!isSupported) return null;

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2 transition-all duration-200 active:scale-95 ${
        isSpeaking
          ? "bg-red-100 border-red-400 text-red-700"
          : "bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-200"
      }`}
      aria-label={isSpeaking ? "Parar leitura" : label}
      title={isSpeaking ? "Parar leitura" : label}
    >
      {isSpeaking ? <VolumeX size={iconSizes[size]} /> : <Volume2 size={iconSizes[size]} />}
    </button>
  );
}
