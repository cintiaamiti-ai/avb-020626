import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, BookOpenCheck, Eye, Wind, PenLine } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const TCC_AUDIO_TEXT = `TCC e Atenção Plena. Técnicas baseadas em Terapia Cognitivo-Comportamental para ajudar na recuperação. Reestruturação Cognitiva: identifique pensamentos automáticos sobre o jogo e questione-os. Atenção Plena: pratique estar presente no momento, observando pensamentos sem agir. Respiração Guiada: inspire por 4 segundos, segure por 4, solte por 4. Repita 5 vezes. Registro de Pensamentos: anote o pensamento, a emoção e uma alternativa racional.`;

const tecnicas = [
  {
    titulo: "Reestruturação Cognitiva",
    descricao: "Aprenda a questionar pensamentos automáticos sobre o jogo. Quando vier o pensamento \"preciso jogar\", pergunte: Isso é um fato ou uma emoção?",
    icone: PenLine,
    exercicio: 6,
    nomeExercicio: "Diário de Pensamentos",
  },
  {
    titulo: "Técnica 5-4-3-2-1 (Atenção Plena)",
    descricao: "Use seus 5 sentidos para voltar ao momento presente quando a ansiedade ou o impulso aparecerem. Funciona em qualquer lugar.",
    icone: Eye,
    exercicio: 7,
    nomeExercicio: "Técnica 5-4-3-2-1",
  },
  {
    titulo: "Respiração Quadrada (4-4-4-4)",
    descricao: "Inspire por 4 segundos, segure por 4, expire por 4, pause por 4. Acalma o sistema nervoso em minutos.",
    icone: Wind,
    exercicio: 8,
    nomeExercicio: "Respiração Quadrada",
  },
];

export default function TCCMindfulness() {
  return (
    <PageAudioWrapper pageText={TCC_AUDIO_TEXT} label="Ouvir técnicas">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">TCC e Atenção Plena</h1>
          <p className="font-body text-muted-foreground mb-4">
            Técnicas baseadas em Terapia Cognitivo-Comportamental e Atenção Plena para lidar com impulsos e pensamentos automáticos.
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cordel p-6 mb-8 bg-[oklch(0.50_0.14_155/0.05)]"
        >
          <div className="flex gap-3">
            <BookOpenCheck className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg mb-2">Como funciona?</h3>
              <p className="font-body text-sm text-foreground leading-relaxed mb-3">
                A Terapia Cognitivo-Comportamental (TCC) ajuda a identificar e modificar padrões de pensamento
                que mantêm o comportamento de jogo.
              </p>
              <p className="font-body text-sm text-foreground leading-relaxed mb-3">
                A Atenção Plena treina sua capacidade de observar pensamentos e impulsos
                sem agir automaticamente sobre eles.
              </p>
              <p className="font-body text-sm text-foreground leading-relaxed">
                Juntas, essas técnicas ajudam a criar um espaço entre o impulso e a ação — e é nesse espaço
                que mora a sua liberdade de escolha.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Techniques */}
        <h2 className="text-xl mb-6">Técnicas Práticas</h2>
        <div className="space-y-5 mb-8">
          {tecnicas.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-cordel p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent text-white rounded-md border-2 border-foreground flex items-center justify-center">
                  <t.icone className="w-5 h-5" />
                </div>
                <h3 className="text-lg">{t.titulo}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4">
                {t.descricao}
              </p>
              <Link href={`/exercicio/${t.exercicio}`}>
                <button className="px-4 py-2 bg-accent text-white font-body font-bold text-sm border-2 border-foreground rounded-md shadow-[2px_2px_0_oklch(0.15_0.02_50)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_oklch(0.15_0.02_50)] transition-all">
                  Praticar: {t.nomeExercicio}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Key insight */}
        <div className="card-cordel p-6 bg-muted text-center">
          <p className="font-body text-sm italic text-muted-foreground mb-2">
            "Você não precisa acreditar em cada pensamento que aparece na sua mente."
          </p>
          <p className="font-body text-xs text-muted-foreground">
            A prática regular dessas técnicas fortalece sua capacidade de escolher como responder aos impulsos.
          </p>
        </div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}
