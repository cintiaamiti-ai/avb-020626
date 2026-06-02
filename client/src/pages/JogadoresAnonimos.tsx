import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Users, Phone, CheckCircle2, Heart } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const JA_AUDIO_TEXT = `Jogadores Anônimos. Grupo de apoio entre iguais, gratuito e sigiloso. Telefone: 11, 3229-1615. O que é: um grupo de homens e mulheres que compartilham experiências e se ajudam mutuamente na recuperação do jogo compulsivo. Como funciona: reuniões presenciais e online, sem julgamento, sem custo. Qualquer pessoa pode participar. Gam-Anon: grupo de apoio para familiares de jogadores. Mesmo telefone. Você não precisa enfrentar isso sozinho.`;

export default function JogadoresAnonimos() {
  return (
    <PageAudioWrapper pageText={JA_AUDIO_TEXT} label="Ouvir sobre Jogadores Anônimos">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">Jogadores Anônimos (JA)</h1>
          <p className="font-body text-muted-foreground mb-6">
            Um grupo de apoio entre iguais, formado por pessoas que entendem o que você está passando.
          </p>
        </motion.div>

        {/* What is JA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cordel p-6 mb-6"
        >
          <div className="flex gap-3">
            <Users className="w-6 h-6 text-[oklch(0.40_0.14_155)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg mb-2">O que é o JA?</h3>
              <p className="font-body text-sm text-foreground leading-relaxed mb-3">
                Jogadores Anônimos é um grupo de ajuda mútua formado por homens e mulheres que compartilham
                suas experiências, forças e esperanças para resolver o problema comum do jogo compulsivo.
              </p>
              <p className="font-body text-sm text-foreground leading-relaxed">
                Não há custo para participar. Não é necessário cadastro. O único requisito é o desejo de parar de jogar.
              </p>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6"
        >
          <h3 className="text-lg mb-4">Como funciona?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="font-body text-sm">Reuniões presenciais e online em todo o Brasil</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="font-body text-sm">Totalmente gratuito — sem mensalidade ou taxa</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="font-body text-sm">Sigilo absoluto — o que é dito na reunião fica na reunião</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="font-body text-sm">Sem necessidade de cadastro ou identificação</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="font-body text-sm">Disponível em todo o Brasil — presencial e online</p>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6 bg-[oklch(0.40_0.14_155/0.05)]"
        >
          <h3 className="text-lg mb-4">Como participar?</h3>
          <a href="tel:+551132291615" className="flex items-center gap-3 p-4 bg-background rounded-md border-2 border-foreground hover:bg-muted transition-colors mb-4">
            <Phone className="w-6 h-6 text-accent" />
            <div>
              <p className="font-body font-bold">Ligue: (11) 3229-1615</p>
              <p className="font-body text-xs text-muted-foreground">Informações sobre reuniões presenciais e online</p>
            </div>
          </a>
          <p className="font-body text-sm text-muted-foreground">
            Você pode participar apenas ouvindo na primeira vez. Não precisa falar se não quiser.
          </p>
        </motion.div>

        {/* Gam-Anon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6"
        >
          <div className="flex gap-3">
            <Heart className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg mb-2">Gam-Anon — Para Familiares</h3>
              <p className="font-body text-sm text-foreground leading-relaxed mb-3">
                O Gam-Anon é um grupo de apoio para familiares e pessoas próximas de quem tem problemas com o jogo.
                Familiares também sofrem e também precisam de cuidado.
              </p>
              <p className="font-body text-sm text-foreground leading-relaxed">
                As reuniões acontecem nos mesmos locais e horários do JA, em salas separadas.
                Ligue para (11) 3229-1615 para informações.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="bg-accent text-white p-4 rounded-md border-2 border-foreground text-center">
          <p className="font-body font-bold text-sm">
            ✓ Gratuito · ✓ Sem necessidade de cadastro · ✓ Disponível em todo o Brasil · ✓ Online e presencial
          </p>
        </div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}
