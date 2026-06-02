/**
 * Hook de Text-to-Speech para acessibilidade
 * Usa a Web Speech API nativa do navegador
 * Seleciona automaticamente a melhor voz pt-BR disponível
 * Inclui pausas naturais e workaround Chrome Android
 */
import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  externalRate?: number;
}

interface UseSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  rate: number;
  setRate: (rate: number) => void;
}

export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(options.rate || 0.85);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sincronizar com rate externo (do contexto de acessibilidade)
  useEffect(() => {
    if (options.externalRate !== undefined && options.externalRate !== rate) {
      setRate(options.externalRate);
    }
  }, [options.externalRate]);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);

    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const vozesPreferidas = [
          "Google português do Brasil",
          "Google portugues do Brasil",
          "Microsoft Francisca Online",
          "Microsoft Francisca",
          "Microsoft Daniel Online",
          "Microsoft Daniel",
          "Luciana",
          "Felipe",
          "pt-BR-Wavenet-A",
          "pt-BR-Wavenet-B",
          "pt-BR-Standard-A",
        ];

        let vozSelecionada: SpeechSynthesisVoice | undefined;

        for (const nome of vozesPreferidas) {
          vozSelecionada = voices.find(
            (v) =>
              v.name.toLowerCase().includes(nome.toLowerCase()) &&
              (v.lang === "pt-BR" || v.lang.startsWith("pt"))
          );
          if (vozSelecionada) break;
        }

        if (!vozSelecionada) {
          vozSelecionada = voices.find(
            (v) =>
              (v.lang === "pt-BR" || v.lang.startsWith("pt")) &&
              v.localService === false
          );
        }

        if (!vozSelecionada) {
          vozSelecionada = voices.find(
            (v) => v.lang === "pt-BR" || v.lang.startsWith("pt")
          );
        }

        if (vozSelecionada) {
          voiceRef.current = vozSelecionada;
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
      }
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;

      window.speechSynthesis.cancel();

      // Pausas naturais entre frases
      const adicionarPausas = (t: string): string =>
        t
          .replace(/\. /g, "...  ")
          .replace(/\? /g, "?...  ")
          .replace(/! /g, "!...  ")
          .replace(/ — /g, "...  ")
          .replace(/; /g, ";  ");

      const utterance = new SpeechSynthesisUtterance(adicionarPausas(text));
      utterance.rate = rate;
      utterance.pitch = options.pitch || 0.92;
      utterance.volume = options.volume || 1;
      utterance.lang = "pt-BR";

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      // Workaround bug Chrome Android (para após ~15s)
      const keepAlive = setInterval(() => {
        if (
          window.speechSynthesis.speaking &&
          !window.speechSynthesis.paused
        ) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
      keepAliveRef.current = keepAlive;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        clearInterval(keepAlive);
        keepAliveRef.current = null;
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        clearInterval(keepAlive);
        keepAliveRef.current = null;
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, options.pitch, options.volume]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    rate,
    setRate,
  };
}
