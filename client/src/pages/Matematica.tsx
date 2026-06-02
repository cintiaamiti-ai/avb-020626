import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, TrendingDown, Percent, DollarSign, AlertTriangle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

// Constantes nomeadas (B-06)
const MARGEM_CASA = 0.15;

const MATH_AUDIO_TEXT = `A Matemática que as Plataformas Escondem. A probabilidade está sempre contra o jogador. Veja os números reais. De cada 100 reais apostados, a casa fica com 15 reais. Você nunca recebe de volta tudo que apostou. A verdade: as casas de apostas são projetadas para lucrar. Não é sorte, é matemática.`;

const MATH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663621494533/PAsCAKgGiiDo7MBoxQXEkZ/math-reality-S2pntUrPEZypCijUsJe8VH.webp";

function Bolinhas({ total, destaque, corDestaque, corNormal }: {
  total: number; destaque: number; corDestaque: string; corNormal: string;
}) {
  return (
    <div className="flex flex-wrap gap-1 justify-center py-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full border border-foreground/30 ${i < destaque ? corDestaque : corNormal}`}
        />
      ))}
    </div>
  );
}

export default function Matematica() {
  const { state } = useApp();
  // C-11: input editável para valor apostado
  const [valorApostado, setValorApostado] = useState(200);

  const perdaAnual = Math.round(valorApostado * 12 * MARGEM_CASA);
  const perda5Anos = perdaAnual * 5;

  const trilhaABEP = () => {
    if (state.nivelABEP === "DE") return {
      titulo: "Na sua realidade:",
      texto: `R$ ${valorApostado.toLocaleString("pt-BR")} por mês são botijões de gás, cestas básicas, contas. Em um ano de apostas: R$ ${(valorApostado * 12).toLocaleString("pt-BR")} que poderiam aquecer sua comida e proteger sua família.`,
      icone: "🔥",
    };
    if (state.nivelABEP === "C") return {
      titulo: "Na sua realidade:",
      texto: `R$ ${valorApostado.toLocaleString("pt-BR")} por mês são parcelas do celular, roupas, escola. Em um ano: R$ ${(valorApostado * 12).toLocaleString("pt-BR")} que poderiam quitar dívidas ou garantir uma reserva.`,
      icone: "📱",
    };
    return {
      titulo: "Na sua realidade:",
      texto: `R$ ${valorApostado.toLocaleString("pt-BR")} por mês rendem zero nas apostas. Investidos com juros compostos, em 5 anos seriam muito mais. As plataformas ficam com ${Math.round(MARGEM_CASA * 100)}% de tudo.`,
      icone: "📊",
    };
  };

  const trilha = trilhaABEP();

  return (
    <PageAudioWrapper pageText={MATH_AUDIO_TEXT} label="Ouvir explicação matemática">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">A Matemática que as Plataformas Escondem</h1>
          <p className="font-body text-muted-foreground mb-8">
            A probabilidade está <strong className="text-destructive">sempre</strong> contra o jogador.
          </p>
        </motion.div>

        {/* C-11: Input editável do valor apostado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-cordel p-5 mb-8 bg-[oklch(0.50_0.2_25/0.05)] border-destructive"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-body text-sm font-bold flex-1">Quanto você aposta por mês?</span>
            <div className="flex items-center gap-1">
              <span className="font-body text-sm font-bold">R$</span>
              <input
                type="number"
                value={valorApostado}
                onChange={(e) => setValorApostado(Math.max(1, Math.min(100000, Number(e.target.value))))}
                className="w-28 px-2 py-2 font-body font-bold text-lg border-2 border-foreground rounded-md text-center bg-background focus:outline-none focus:border-destructive transition-colors"
                min={1}
                max={100000}
                aria-label="Valor apostado mensalmente em reais"
              />
            </div>
          </div>
          <p className="font-body text-xs text-muted-foreground mt-2">
            Ajuste para ver os cálculos com seus valores reais.
          </p>
        </motion.div>

        {/* Ilustração */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-md overflow-hidden border-3 border-foreground shadow-[4px_4px_0_oklch(0.15_0.02_50)] mb-8"
        >
          <img src={MATH_IMG} alt="Ilustração mostrando a balança da probabilidade contra o jogador" className="w-full" />
        </motion.div>

        {/* De cada R$100 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-6 h-6 text-destructive" />
            <h3 className="text-lg">De cada R$ 100 apostados:</h3>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-3">
            Cada bolinha = R$ 1. As <span className="text-destructive font-bold">vermelhas</span> ficam com a casa.
          </p>
          <Bolinhas total={100} destaque={15} corDestaque="bg-destructive" corNormal="bg-muted" />
          <p className="font-body text-center text-sm mt-3">
            <span className="text-destructive font-bold">R$ 15</span> ficam com a plataforma. Você nunca recebe de volta.
          </p>
        </motion.div>

        {/* Roleta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Percent className="w-6 h-6 text-accent" />
            <h3 className="text-lg">Roleta: 100 rodadas</h3>
          </div>
          <Bolinhas total={100} destaque={3} corDestaque="bg-accent" corNormal="bg-destructive/30" />
          <p className="font-body text-center text-sm mt-3">
            Você ganha <span className="text-accent font-bold">~3 vezes</span> em 100 rodadas.
            Perde <span className="text-destructive font-bold">97 vezes</span>.
          </p>
        </motion.div>

        {/* Analogia contextual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6 bg-secondary border-foreground"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{trilha.icone}</span>
            <h3 className="text-lg">{trilha.titulo}</h3>
          </div>
          <p className="font-body text-base leading-relaxed mb-4">{trilha.texto}</p>

          {/* Visual dinâmico */}
          <div className="bg-background/50 rounded-lg p-4">
            <p className="font-body text-xs text-muted-foreground mb-2 text-center">
              R$ {valorApostado.toLocaleString("pt-BR")}/mês × 12 meses = R$ {(valorApostado * 12).toLocaleString("pt-BR")} apostados
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: Math.min(12, 12) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="min-w-[3rem] h-12 rounded-lg bg-destructive/20 border-2 border-destructive/40 flex items-center justify-center px-1"
                >
                  <span className="font-body text-xs font-bold text-destructive">
                    R${valorApostado >= 1000 ? `${(valorApostado/1000).toFixed(1)}k` : valorApostado}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="font-body text-xs text-center mt-3 text-destructive font-bold">
              12 meses × R$ {valorApostado.toLocaleString("pt-BR")} = R$ {(valorApostado * 12).toLocaleString("pt-BR")} que a plataforma ficou
            </p>
          </div>
        </motion.div>

        {/* Simulação dinâmica */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-destructive" />
            <h3 className="text-lg">Simulação: 5 anos de apostas</h3>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-foreground/20">
              <span className="font-body text-sm">Apostado por mês</span>
              <span className="font-body font-bold text-lg">R$ {valorApostado.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-foreground/20">
              <span className="font-body text-sm">Perda estimada em 1 ano (15%)</span>
              <span className="font-body font-bold text-lg text-destructive">- R$ {perdaAnual.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-foreground/20">
              <span className="font-body text-sm">Perda estimada em 5 anos</span>
              <span className="font-body font-bold text-lg text-destructive">- R$ {perda5Anos.toLocaleString("pt-BR")}</span>
            </div>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Esse dinheiro poderia pagar contas, comprar um eletrodoméstico ou garantir a segurança da sua família.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="card-cordel p-6 bg-[oklch(0.50_0.2_25/0.08)] border-destructive"
        >
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <h3 className="text-lg mb-2">A Verdade que Ninguém Conta</h3>
              <p className="font-body text-sm text-foreground leading-relaxed">
                As casas de apostas são projetadas para lucrar. Elas usam algoritmos, design persuasivo e
                recompensas intermitentes para manter você jogando. Não é sorte — é matemática.
                E a matemática está sempre do lado delas.
              </p>
              <p className="font-body text-sm text-foreground leading-relaxed mt-3">
                <strong>Entender isso não é sorte. É sabedoria.</strong>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}
