import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, AlertCircle, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { AudioButtonInline } from "@/components/AudioPlayer";

const ESCALA_AUDIO_TEXT = `Escala dos 3 Cês. Responda 3 perguntas sobre sua relação com o jogo. Pergunta 1, Controle: Você já tentou parar ou reduzir as apostas, mas não conseguiu? Pergunta 2, Enfrentamento: Você aposta quando se sente triste, ansioso ou para esquecer problemas? Pergunta 3, Perseguição: Você volta a apostar para tentar recuperar o dinheiro que perdeu? Responda SIM ou NÃO para cada pergunta.`;

interface Pergunta3C {
  texto: string;
  explicacao: string;
  categoria: "controle" | "enfrentamento" | "perseguicao";
}

const perguntas: Pergunta3C[] = [
  {
    texto: "Você já tentou parar ou reduzir as apostas, mas não conseguiu?",
    explicacao: "Não conseguir parar não é falta de força de vontade. É o efeito que o jogo provoca no comportamento com o tempo.",
    categoria: "controle",
  },
  {
    texto: "Você aposta quando se sente triste, ansioso ou para esquecer problemas?",
    explicacao: "Usar o jogo para lidar com emoções difíceis é chamado de jogo de escape. Com o tempo, a condição fica cada vez mais difícil de controlar.",
    categoria: "enfrentamento",
  },
  {
    texto: "Você volta a apostar para tentar recuperar o dinheiro que perdeu?",
    explicacao: "Esse comportamento, chamado de caça ao prejuízo, é uma das armadilhas mais comuns e difíceis de perceber. As perdas só aumentam.",
    categoria: "perseguicao",
  },
];

export default function Escala3Cs() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, boolean>>({});
  const [concluido, setConcluido] = useState(false);

  const handleResposta = (sim: boolean) => {
    const novas = { ...respostas, [etapa]: sim };
    setRespostas(novas);
    if (etapa < perguntas.length - 1) {
      setEtapa(etapa + 1);
    } else {
      setConcluido(true);
    }
  };

  const getNivel = () => {
    const total = Object.values(respostas).filter(Boolean).length;
    if (total === 0) return { nivel: "verde", titulo: "Baixo Risco", cor: "bg-accent", mensagem: "Nenhuma resposta SIM. Continue atento e use as ferramentas de prevenção deste aplicativo." };
    if (total <= 1) return { nivel: "amarelo", titulo: "Atenção", cor: "bg-[oklch(0.70_0.15_80)]", mensagem: "Um sinal identificado merece atenção. Use as ferramentas deste aplicativo e considere conversar com um profissional de saúde se sentir necessidade." };
    return { nivel: "vermelho", titulo: "Você merece apoio", cor: "bg-[oklch(0.50_0.2_25/0.80)]", mensagem: "Você respondeu SIM para as 3 dimensões. Isso não é fraqueza — o Transtorno do Jogo é uma condição de saúde com tratamento eficaz. Falar com um profissional pode fazer toda a diferença." };
  };

  if (concluido) {
    const resultado = getNivel();

    return (
      <PageAudioWrapper pageText={`Resultado da Escala dos 3 Cês. ${resultado.titulo}. ${resultado.mensagem}. CVV, ligue 188. Jogadores Anônimos, ligue 11, 3229-1615.`} label="Ouvir resultado">
      <div className="flex-1 container py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <div className="card-cordel p-8">
            <h1 className="text-2xl mb-6 text-center">Resultado da Escala dos 3 Cs</h1>
            
            <div className={`${resultado.cor} text-white p-4 rounded-md border-2 border-foreground mb-6 text-center`}>
              <p className="font-body font-bold text-xl">{resultado.titulo}</p>
            </div>

            <div className="space-y-3 mb-6">
              {perguntas.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-2 border-foreground rounded-md">
                  <span className="font-body text-sm flex-1">{p.categoria === "controle" ? "Controle" : p.categoria === "enfrentamento" ? "Enfrentamento" : "Perseguição"}</span>
                  <span className={`font-body font-bold ${respostas[i] ? "text-destructive" : "text-accent"}`}>
                    {respostas[i] ? "SIM" : "NÃO"}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-body text-sm text-muted-foreground mb-6">
              {resultado.mensagem}
            </p>

            {/* Emergency contacts always visible */}
            <div className="bg-muted p-4 rounded-md border border-foreground/20 mb-6">
              <p className="font-body text-xs font-semibold mb-2">Precisa de apoio?</p>
              <div className="space-y-1">
                <a href="tel:188" className="flex items-center gap-2 font-body text-sm hover:text-primary transition-colors">
                  <Phone className="w-3 h-3" /> CVV — 188 (24h · Gratuito · Sigiloso)
                </a>
                <a href="tel:+551132291615" className="flex items-center gap-2 font-body text-sm hover:text-accent transition-colors">
                  <Users className="w-3 h-3" /> JA — (11) 3229-1615
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => { setEtapa(0); setRespostas({}); setConcluido(false); }}
                variant="outline"
                className="w-full border-2 border-foreground"
              >
                Refazer Avaliação
              </Button>
              <Link href="/exercicios">
                <Button className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)]">
                  Ver Exercícios Terapêuticos
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      </PageAudioWrapper>
    );
  }

  return (
    <PageAudioWrapper pageText={ESCALA_AUDIO_TEXT} label="Ouvir instruções">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl mb-2">Escala dos 3 Cs</h1>
        <p className="font-body text-muted-foreground mb-2">
          Responda com honestidade. Não existe resposta certa ou errada.
        </p>
        <p className="font-body text-sm text-muted-foreground mb-6">
          Avalie três dimensões: <strong>Controle</strong>, <strong>Enfrentamento</strong> e <strong>Perseguição</strong>.
        </p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {perguntas.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full border border-foreground/30 ${
                i <= etapa ? "bg-secondary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={etapa}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card-cordel p-6"
          >
            <p className="font-body text-xs text-muted-foreground mb-1">
              Pergunta {etapa + 1} de {perguntas.length}
            </p>
            <p className="font-body text-xs text-secondary font-semibold mb-4 uppercase">
              {perguntas[etapa].categoria === "controle" && "Dimensão: Controle"}
              {perguntas[etapa].categoria === "enfrentamento" && "Dimensão: Enfrentamento"}
              {perguntas[etapa].categoria === "perseguicao" && "Dimensão: Perseguição"}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl flex-1">{perguntas[etapa].texto}</h2>
              <AudioButtonInline text={`${perguntas[etapa].texto}. ${perguntas[etapa].explicacao}`} label="Ouvir pergunta" size="md" />
            </div>
            <p className="font-body text-sm text-muted-foreground mb-6 italic">
              {perguntas[etapa].explicacao}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleResposta(true)}
                className="flex-1 p-4 font-body font-bold border-2 border-foreground rounded-md bg-destructive/10 hover:bg-destructive hover:text-white transition-colors shadow-[2px_2px_0_oklch(0.15_0.02_50)] flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                Sim
              </button>
              <button
                onClick={() => handleResposta(false)}
                className="flex-1 p-4 font-body font-bold border-2 border-foreground rounded-md bg-accent/10 hover:bg-accent hover:text-white transition-colors shadow-[2px_2px_0_oklch(0.15_0.02_50)] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Não
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {etapa > 0 && (
          <button
            onClick={() => setEtapa(etapa - 1)}
            className="mt-4 font-body text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Pergunta anterior
          </button>
        )}
      </div>
    </div>
    </PageAudioWrapper>
  );
}
