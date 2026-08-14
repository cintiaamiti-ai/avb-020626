import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Brain } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const DISTORCOES_AUDIO_TEXT = `Distorções Cognitivas do Jogo. As 8 armadilhas que sua mente cria. 1. A Ilusão de Controle: você pensa que tem um sistema, mas algoritmos controlam os resultados. 2. O Quase-Ganho: quase é derrota, os jogos criam essa sensação propositalmente. 3. A Falácia do Jogador: cada rodada é independente, o passado não influencia o futuro. 4. A Caça ao Prejuízo: apostar mais para recuperar só aumenta a perda. 5. A Minimização: dizer que está tudo sob controle quando não está. 6. Tudo ou Nada: já joguei hoje, o dia está perdido. 7. A Sorte Pessoal: achar que tem um dom especial para ganhar. 8. A Justificativa Emocional: usar estresse como razão para jogar.`;

const distorcoes = [
  {
    numero: 1,
    titulo: "A Ilusão de Controle",
    pensamento: "\"Tenho um sistema. Sei o que faço.\"",
    realidade: "Algoritmos controlam os resultados. Nenhum sistema humano muda isso.",
  },
  {
    numero: 2,
    titulo: "O Quase-Ganho",
    pensamento: "\"Quase ganhei! Estou chegando lá.\"",
    realidade: "\"Quase\" é derrota. Os jogos criam essa sensação propositalmente.",
  },
  {
    numero: 3,
    titulo: "A Falácia do Jogador",
    pensamento: "\"Perdi 5 vezes. Na próxima ganho.\"",
    realidade: "Cada rodada é independente. A probabilidade não tem memória.",
  },
  {
    numero: 4,
    titulo: "A Caça ao Prejuízo",
    pensamento: "\"Preciso recuperar apostando mais.\"",
    realidade: "É uma das mais comuns e difíceis de perceber. As perdas só aumentam.",
  },
  {
    numero: 5,
    titulo: "A Minimização",
    pensamento: "\"Só jogo por diversão. Está tudo sob controle.\"",
    realidade: "Quando afeta finanças e relações, já não é diversão.",
  },
  {
    numero: 6,
    titulo: "Tudo ou Nada",
    pensamento: "\"Já joguei hoje. O dia está perdido. Vou jogar mais.\"",
    realidade: "Parar agora é sempre melhor do que continuar.",
  },
  {
    numero: 7,
    titulo: "A Sorte Pessoal",
    pensamento: "\"Sou sortudo. Tenho um dom.\"",
    realidade: "Sorte não é característica pessoal. Os resultados são aleatórios.",
  },
  {
    numero: 8,
    titulo: "A Justificativa Emocional",
    pensamento: "\"Estou estressado. Mereço jogar.\"",
    realidade: "Usar o jogo para regular emoções cria dependência emocional do comportamento.",
  },
];

export default function Distorcoes() {
  return (
    <PageAudioWrapper pageText={DISTORCOES_AUDIO_TEXT} label="Ouvir distorções cognitivas">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">Distorções Cognitivas</h1>
          <p className="font-body text-muted-foreground mb-4">
            As armadilhas da mente que o jogo usa para te enganar.
          </p>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cordel p-6 mb-6 bg-[oklch(0.40_0.18_310/0.05)]"
        >
          <div className="flex gap-3">
            <Brain className="w-6 h-6 text-[oklch(0.40_0.18_310)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg mb-2">O que é uma distorção cognitiva?</h3>
              <p className="font-body text-sm text-foreground leading-relaxed mb-3">
                Uma distorção cognitiva é uma forma errada de pensar que parece completamente verdadeira
                no momento — mas que não reflete a realidade.
              </p>
              <p className="font-body text-sm text-foreground leading-relaxed mb-3">
                No Transtorno do Jogo, esses pensamentos ficam muito mais frequentes e intensos,
                porque o próprio jogo os alimenta.
              </p>
              <p className="font-body text-sm text-foreground leading-relaxed">
                Reconhecer esses pensamentos é o primeiro passo para não ser controlado por eles.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="card-cordel p-4 mb-8 bg-[oklch(0.40_0.18_310/0.08)]">
          <p className="font-body text-sm text-center italic">
            "Distorção cognitiva não é loucura. É um padrão que pode ser identificado e modificado com prática."
          </p>
        </div>

        {/* 8 Distortions Grid */}
        <h2 className="text-xl mb-6">As 8 Distorções Mais Comuns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {distorcoes.map((d, i) => (
            <motion.div
              key={d.numero}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card-cordel p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-[oklch(0.40_0.18_310)] text-white rounded-full border-2 border-foreground flex items-center justify-center font-body font-bold text-xs">
                  {d.numero}
                </span>
                <h3 className="text-sm font-bold">{d.titulo}</h3>
              </div>
              <p className="font-body text-sm text-destructive font-semibold mb-2">
                {d.pensamento}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                <strong className="text-foreground">Realidade:</strong> {d.realidade}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA to exercise */}
        <div className="card-cordel p-6 text-center">
          <p className="font-body text-sm text-muted-foreground mb-4">
            Quer identificar quais distorções são mais fortes em você?
          </p>
          <Link href="/exercicio/5">
            <button className="px-6 py-3 bg-[oklch(0.40_0.18_310)] text-white font-body font-bold border-2 border-foreground rounded-md shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)] transition-all">
              Fazer Exercício 5 — Identifique suas Distorções
            </button>
          </Link>
        </div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}
