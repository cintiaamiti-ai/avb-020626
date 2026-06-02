/**
 * PageAudioWrapper - Envolve páginas com funcionalidade de áudio
 * Extrai o texto da página e fornece o AudioPlayer flutuante
 * Também faz leitura automática se a opção estiver ativada
 */
import { useEffect } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useSpeech } from "@/hooks/useSpeech";

interface PageAudioWrapperProps {
  /** Texto que será lido em voz alta (conteúdo da página) */
  pageText: string;
  /** Label para o botão de áudio */
  label?: string;
  children: React.ReactNode;
}

export function PageAudioWrapper({ pageText, label, children }: PageAudioWrapperProps) {
  const { autoRead, speechRate } = useAccessibility();
  const { speak, stop, isSupported } = useSpeech({ externalRate: speechRate });

  // Leitura automática ao entrar na página (se ativado)
  useEffect(() => {
    if (autoRead && isSupported && pageText) {
      // Pequeno delay para garantir que a página renderizou
      const timer = setTimeout(() => {
        speak(pageText);
      }, 500);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
    return () => {
      // Parar leitura ao sair da página
      if (isSupported) stop();
    };
  }, [autoRead, isSupported]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children}
      <AudioPlayer text={pageText} label={label} />
    </>
  );
}
