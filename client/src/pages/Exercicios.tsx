import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const EXERCICIOS_AUDIO_TEXT = `Exercícios Terapêuticos. 12 atividades para sua recuperação. Exercício 1: Inventário de Perdas. Exercício 2: Meu Ciclo Pessoal. Exercício 3: Minha Rede de Apoio. Exercício 4: Carta à Família. Exercício 5: Distorções Cognitivas. Exercício 6: Diário de Pensamentos. Exercício 7: Técnica 5-4-3-2-1. Exercício 8: Respiração Quadrada. Exercício 9: Análise do Lapso. Exercício 10: Análise Matemática. Exercício 11: Arsenal de Recuperação. Exercício 12: Compromisso de Mudança. Toque em qualquer exercício para começar.`;

const EXERCICIOS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663621494533/PAsCAKgGiiDo7MBoxQXEkZ/exercises-illustration-6x5qmGUBZfoqPQZgwCKzAg.webp";

export const exerciciosList = [
  { id: 1, titulo: "Onde Estou Hoje?", subtitulo: "Semáforo", cor: "bg-accent" },
  { id: 2, titulo: "Meu Ciclo Pessoal", subtitulo: "Gatilho-Aposta-Perda-Recomeço", cor: "bg-secondary" },
  { id: 3, titulo: "Meu Plano Contra o Impulso", subtitulo: "Contatos opcionais", cor: "bg-destructive" },
  { id: 4, titulo: "Para Quem Está ao Lado", subtitulo: "Família", cor: "bg-primary" },
  { id: 5, titulo: "Identifique suas Distorções", subtitulo: "Armadilhas da Mente", cor: "bg-[oklch(0.40_0.18_310)]" },
  { id: 6, titulo: "Diário de Pensamentos", subtitulo: "Fato vs Emoção", cor: "bg-accent" },
  { id: 7, titulo: "Técnica 5-4-3-2-1", subtitulo: "Atenção Plena", cor: "bg-primary" },
  { id: 8, titulo: "Respiração Quadrada", subtitulo: "4-4-4-4", cor: "bg-accent" },
  { id: 9, titulo: "Análise do Lapso", subtitulo: "Aprendizado sem Punição", cor: "bg-[oklch(0.55_0.14_60)]" },
  { id: 10, titulo: "Análise Matemática da Perda Real", subtitulo: "Calculadora", cor: "bg-secondary" },
  { id: 11, titulo: "Arsenal de Recuperação", subtitulo: "Contatos opcionais", cor: "bg-accent" },
  { id: 12, titulo: "Carta para Mim Mesmo", subtitulo: "Assinatura opcional", cor: "bg-primary" },
];

export default function Exercicios() {
  const { state } = useApp();

  return (
    <PageAudioWrapper pageText={EXERCICIOS_AUDIO_TEXT} label="Ouvir lista de exercícios">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">Exercícios Terapêuticos</h1>
          <p className="font-body text-muted-foreground mb-4">
            12 atividades práticas para sua jornada de recuperação. Faça no seu ritmo — cada passo conta.
          </p>
          <p className="font-body text-sm text-accent font-semibold mb-8">
            {state.exerciciosCompletos.length} de 12 concluídos
          </p>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-md overflow-hidden border-3 border-foreground shadow-[4px_4px_0_oklch(0.15_0.02_50)] mb-8"
        >
          <img
            src={EXERCICIOS_IMG}
            alt="Ilustração de pessoa fazendo exercícios terapêuticos"
            className="w-full"
          />
        </motion.div>

        {/* Exercise List */}
        <div className="space-y-3">
          {exerciciosList.map((ex, i) => {
            const completo = state.exerciciosCompletos.includes(ex.id);
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/exercicio/${ex.id}`} className="block">
                  <div className={`card-cordel p-4 flex items-center gap-4 ${completo ? "bg-[oklch(0.50_0.14_155/0.05)]" : ""}`}>
                    <div className={`w-9 h-9 ${ex.cor} rounded-full border-2 border-foreground flex items-center justify-center shrink-0`}>
                      <span className="text-white font-body font-bold text-sm">{ex.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base truncate">{ex.titulo}</h3>
                      <p className="font-body text-xs text-muted-foreground">{ex.subtitulo}</p>
                    </div>
                    {completo ? (
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Privacy notice */}
        <div className="mt-8 p-4 bg-muted rounded-md text-center">
          <p className="font-body text-xs text-muted-foreground">
            Todos os exercícios são salvos apenas no seu dispositivo. Nenhuma informação é enviada para servidores.
          </p>
        </div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}
