/**
 * Painel de Acessibilidade flutuante
 * Botão inteligente com 3 estados: minimizado em atividade, compacto fora, expandido ao abrir
 * Controles: Alto Contraste, Texto Grande, Leitura Automática, Velocidade da Voz, Testar Voz
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, Eye, Type, Volume2, X } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLocation } from "wouter";
import { useSpeech } from "@/hooks/useSpeech";

export function AccessibilityToolbar() {
  const {
    highContrast,
    largeText,
    autoRead,
    speechRate,
    toggleHighContrast,
    toggleLargeText,
    toggleAutoRead,
    setSpeechRate,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [location] = useLocation();

  const emAtividade =
    location.startsWith("/exercicio") ||
    location === "/sos" ||
    location === "/tcc-mindfulness";

  const { speak, stop, isSpeaking, isSupported } = useSpeech({
    externalRate: speechRate,
  });

  const testarVoz = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(
        "Olá. Esta é a voz que vai ler os exercícios para você. Ajuste a velocidade até ficar confortável."
      );
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsMinimized(false);
    else setIsMinimized(true);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl border border-gray-700 w-72 mb-2"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">Acessibilidade</h3>
              <button
                onClick={handleToggle}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Fechar painel de acessibilidade"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Alto Contraste */}
              <button
                onClick={toggleHighContrast}
                className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-left text-sm font-bold transition-colors ${
                  highContrast ? "bg-yellow-500 text-black" : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
              >
                <Eye size={20} />
                <span>Alto Contraste</span>
                <span className="ml-auto text-xs opacity-70">
                  {highContrast ? "Ligado" : "Desligado"}
                </span>
              </button>

              {/* Texto Grande */}
              <button
                onClick={toggleLargeText}
                className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-left text-sm font-bold transition-colors ${
                  largeText ? "bg-yellow-500 text-black" : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label={largeText ? "Desativar texto grande" : "Ativar texto grande"}
              >
                <Type size={20} />
                <span>Texto Grande</span>
                <span className="ml-auto text-xs opacity-70">
                  {largeText ? "Ligado" : "Desligado"}
                </span>
              </button>

              {/* Ler Automático */}
              <button
                onClick={toggleAutoRead}
                className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-left text-sm font-bold transition-colors ${
                  autoRead ? "bg-green-600 text-white" : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label={autoRead ? "Desativar leitura automática" : "Ativar leitura automática"}
              >
                <Volume2 size={20} />
                <span>Ler Automático</span>
                <span className="ml-auto text-xs opacity-70">
                  {autoRead ? "Ligado" : "Desligado"}
                </span>
              </button>

              {/* Velocidade da Voz */}
              <div className="flex flex-col gap-2 bg-white/10 rounded-xl p-3">
                <span className="text-sm font-bold">Velocidade da Voz</span>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSpeechRate(Math.max(0.5, speechRate - 0.25))}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-lg font-bold"
                    aria-label="Voz mais devagar"
                  >
                    −
                  </button>
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-base font-bold">
                      {speechRate <= 0.75
                        ? "🐢 Devagar"
                        : speechRate <= 1.0
                        ? "🚶 Normal"
                        : speechRate <= 1.5
                        ? "🚴 Rápido"
                        : "🏃 Muito rápido"}
                    </span>
                    <span className="text-xs opacity-60">{speechRate.toFixed(2)}x</span>
                  </div>
                  <button
                    onClick={() => setSpeechRate(Math.min(2, speechRate + 0.25))}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-lg font-bold"
                    aria-label="Voz mais rápida"
                  >
                    +
                  </button>
                </div>
                {/* Barra visual */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{ width: `${((speechRate - 0.5) / 1.5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Testar Voz */}
              {isSupported && (
                <button
                  onClick={testarVoz}
                  className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-left text-sm font-bold transition-colors ${
                    isSpeaking ? "bg-red-600 text-white" : "bg-white/10 hover:bg-white/20"
                  }`}
                  aria-label={isSpeaking ? "Parar teste de voz" : "Testar como a voz soa"}
                >
                  <Volume2 size={20} />
                  <span>{isSpeaking ? "Parar teste" : "Ouvir como soa a voz"}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão principal */}
      <button
        onClick={handleToggle}
        title="Acessibilidade"
        aria-label="Abrir painel de acessibilidade"
        aria-expanded={isOpen}
        className={`rounded-full shadow-lg flex items-center justify-center border-2 transition-all duration-300 active:scale-95 ${
          isOpen
            ? "w-14 h-14 bg-yellow-500 border-yellow-700 text-black opacity-100"
            : emAtividade
            ? "w-8 h-8 bg-gray-800 border-gray-600 text-white opacity-20 hover:opacity-90"
            : isMinimized
            ? "w-10 h-10 bg-gray-800 border-gray-600 text-white opacity-40 hover:opacity-100 hover:scale-110"
            : "w-14 h-14 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        }`}
      >
        <Accessibility
          size={isOpen ? 22 : emAtividade ? 14 : isMinimized ? 18 : 22}
        />
      </button>
    </div>
  );
}
