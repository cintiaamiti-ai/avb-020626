import { useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Save, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { exerciciosList } from "./Exercicios";
import { toast } from "sonner";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

// Exercise content definitions - all 12 exercises per spec
const exerciciosConteudo: Record<number, {
  instrucao: string;
  campos?: { id: string; label: string; placeholder: string; tipo?: "textarea" | "radio" }[];
  conteudoEspecial?: string;
  mostrarContatos?: boolean;
  mostrarGamAnon?: boolean;
}> = {
  1: {
    instrucao: "O Semáforo do Jogo ajuda você a identificar em que momento está. Pense com sinceridade sobre sua relação com o jogo hoje.",
    campos: [
      { id: "situacao", label: "Como está sua relação com o jogo hoje?", placeholder: "Descreva com suas palavras...", tipo: "textarea" },
      { id: "semaforo", label: "Qual cor do semáforo representa seu momento?", placeholder: "Verde (controle), Amarelo (atenção) ou Vermelho (perigo)", tipo: "radio" },
      { id: "motivo", label: "Por que escolheu essa cor?", placeholder: "Explique o que te levou a essa conclusão...", tipo: "textarea" },
    ],
  },
  2: {
    instrucao: "Identifique seu ciclo pessoal: o que dispara o gatilho, como acontece a aposta, o que vem depois da perda, e como recomeça.",
    campos: [
      { id: "gatilho", label: "O que dispara minha vontade de jogar? (Gatilho)", placeholder: "Ex: estresse, solidão, dinheiro no bolso, propaganda...", tipo: "textarea" },
      { id: "aposta", label: "Como acontece a aposta? (Ação)", placeholder: "Ex: abro o aplicativo, vou ao local, peço emprestado...", tipo: "textarea" },
      { id: "perda", label: "O que sinto depois de perder? (Consequência)", placeholder: "Ex: culpa, raiva, desespero, vontade de recuperar...", tipo: "textarea" },
      { id: "recomeco", label: "Como recomeço o ciclo? (Recomeço)", placeholder: "Ex: prometo parar, escondo, tento recuperar...", tipo: "textarea" },
    ],
  },
  3: {
    instrucao: "Crie seu plano pessoal para quando a onda de impulso vier. Tenha isso pronto ANTES de precisar.",
    campos: [
      { id: "sinais", label: "Quais sinais aparecem antes do impulso?", placeholder: "Ex: ansiedade, pensamentos sobre dinheiro fácil...", tipo: "textarea" },
      { id: "acao1", label: "Primeira coisa que vou fazer quando sentir o impulso:", placeholder: "Ex: ligar para alguém, sair de casa, usar o cronômetro SOS...", tipo: "textarea" },
      { id: "acao2", label: "Segunda alternativa se a primeira não funcionar:", placeholder: "Ex: usar a técnica 5-4-3-2-1, ligar para o CVV 188...", tipo: "textarea" },
      { id: "pessoa", label: "Pessoa de confiança que posso ligar (opcional):", placeholder: "Nome e telefone (se quiser)...", tipo: "textarea" },
    ],
    mostrarContatos: true,
  },
  4: {
    instrucao: "Este exercício é para quem está ao lado de alguém com Transtorno do Jogo. Familiares também precisam de cuidado.",
    campos: [
      { id: "sentimentos", label: "Como me sinto em relação à situação?", placeholder: "Ex: preocupado, com raiva, impotente, triste...", tipo: "textarea" },
      { id: "limites", label: "Quais limites preciso estabelecer?", placeholder: "Ex: não emprestar dinheiro, não pagar dívidas de jogo...", tipo: "textarea" },
      { id: "cuidado", label: "O que estou fazendo para cuidar de mim?", placeholder: "Ex: terapia, grupo de apoio, atividades prazerosas...", tipo: "textarea" },
      { id: "comunicacao", label: "Como posso me comunicar sem julgar?", placeholder: "Ex: usar 'eu sinto' ao invés de 'você sempre'...", tipo: "textarea" },
    ],
    mostrarGamAnon: true,
  },
  5: {
    instrucao: "Identifique as distorções cognitivas (armadilhas da mente) que o jogo usa para te enganar.",
    campos: [
      { id: "distorcao1", label: "Pensamento: 'Estou devendo, preciso jogar para recuperar'", placeholder: "Realidade: a chance de perder mais é muito maior...", tipo: "textarea" },
      { id: "distorcao2", label: "Pensamento: 'Hoje eu sinto que vou ganhar'", placeholder: "Realidade: sentimentos não mudam probabilidades...", tipo: "textarea" },
      { id: "distorcao3", label: "Pensamento: 'Só mais uma vez e paro'", placeholder: "Realidade: essa promessa já foi feita antes...", tipo: "textarea" },
      { id: "minha", label: "Qual armadilha da mente é mais forte em você?", placeholder: "Descreva com suas palavras...", tipo: "textarea" },
    ],
  },
  6: {
    instrucao: "Separe fatos de emoções. Quando estamos no impulso, confundimos o que sentimos com o que é real.",
    campos: [
      { id: "situacao", label: "Situação que aconteceu:", placeholder: "Descreva o que aconteceu de forma objetiva...", tipo: "textarea" },
      { id: "pensamento", label: "Pensamento que veio à mente:", placeholder: "O que você pensou na hora...", tipo: "textarea" },
      { id: "emocao", label: "Emoção que sentiu (e intensidade 0-10):", placeholder: "Ex: ansiedade (8), raiva (6)...", tipo: "textarea" },
      { id: "fato", label: "Qual é o FATO real (sem emoção)?", placeholder: "Reescreva a situação apenas com fatos comprováveis...", tipo: "textarea" },
    ],
  },
  7: {
    instrucao: "A técnica 5-4-3-2-1 te traz para o momento presente quando a ansiedade ou o impulso aparecem. Use seus 5 sentidos.",
    campos: [
      { id: "cinco", label: "5 coisas que VEJO agora:", placeholder: "Olhe ao redor e descreva 5 coisas...", tipo: "textarea" },
      { id: "quatro", label: "4 coisas que posso TOCAR:", placeholder: "Toque e descreva as texturas...", tipo: "textarea" },
      { id: "tres", label: "3 coisas que OUÇO:", placeholder: "Preste atenção nos sons ao redor...", tipo: "textarea" },
      { id: "dois", label: "2 coisas que CHEIRO:", placeholder: "Respire fundo e identifique cheiros...", tipo: "textarea" },
      { id: "um", label: "1 coisa que posso SABOREAR:", placeholder: "Beba água ou note o sabor na boca...", tipo: "textarea" },
    ],
  },
  8: {
    instrucao: "A Respiração Quadrada (4-4-4-4) acalma o sistema nervoso em minutos. Inspire 4s, segure 4s, expire 4s, pause 4s.",
    conteudoEspecial: "respiracao",
    campos: [
      { id: "antes", label: "Como me sinto ANTES do exercício (0-10):", placeholder: "Nível de ansiedade antes...", tipo: "textarea" },
      { id: "depois", label: "Como me sinto DEPOIS do exercício (0-10):", placeholder: "Nível de ansiedade depois...", tipo: "textarea" },
    ],
  },
  9: {
    instrucao: "Se houve um lapso (voltou a jogar), não se puna. Analise o que aconteceu para aprender e se fortalecer.",
    campos: [
      { id: "oqueoconteceu", label: "O que aconteceu? (Sem julgamento)", placeholder: "Descreva a situação com calma...", tipo: "textarea" },
      { id: "gatilho", label: "O que disparou o lapso?", placeholder: "Qual foi o gatilho...", tipo: "textarea" },
      { id: "aprendizado", label: "O que aprendi com isso?", placeholder: "O que posso fazer diferente na próxima vez...", tipo: "textarea" },
      { id: "proximo", label: "Meu próximo passo concreto:", placeholder: "Uma ação específica que vou tomar...", tipo: "textarea" },
    ],
    mostrarContatos: true,
  },
  10: {
    instrucao: "Calcule quanto dinheiro real você já perdeu com o jogo. Números concretos ajudam a enxergar a realidade.",
    campos: [
      { id: "semanal", label: "Quanto gasta por semana com apostas (em média)?", placeholder: "R$ ...", tipo: "textarea" },
      { id: "meses", label: "Há quantos meses/anos joga?", placeholder: "Ex: 6 meses, 2 anos...", tipo: "textarea" },
      { id: "total", label: "Estimativa do total já gasto:", placeholder: "R$ ...", tipo: "textarea" },
      { id: "oquepoderia", label: "O que esse dinheiro poderia ter comprado?", placeholder: "Ex: 6 meses de aluguel, uma moto, as contas do ano...", tipo: "textarea" },
    ],
  },
  11: {
    instrucao: "Reúna todas as suas ferramentas de recuperação em um só lugar. Este é seu arsenal pessoal.",
    campos: [
      { id: "pessoas", label: "Pessoas que posso ligar quando precisar (opcional):", placeholder: "Nomes e telefones...", tipo: "textarea" },
      { id: "atividades", label: "Atividades que me fazem bem:", placeholder: "Ex: caminhar, ouvir música, cozinhar...", tipo: "textarea" },
      { id: "lembretes", label: "Frases que me fortalecem:", placeholder: "Ex: 'Um dia de cada vez', 'Eu mereço paz'...", tipo: "textarea" },
      { id: "servicos", label: "Serviços de apoio que conheço:", placeholder: "CVV 188, JA (11) 3229-1615, CAPS...", tipo: "textarea" },
    ],
    mostrarContatos: true,
  },
  12: {
    instrucao: "Escreva um recado para si. O que você quer alcançar? Não precisa ser longo. Não precisa ser perfeito. É só seu.",
    campos: [
      { id: "carta", label: "Querido(a) eu...", placeholder: "Escreva com carinho para si mesmo. Reconheça sua coragem de estar aqui, seus esforços, e o que deseja para seu futuro...", tipo: "textarea" },
      { id: "assinatura", label: "Assinatura (opcional):", placeholder: "Seu nome ou como quiser assinar...", tipo: "textarea" },
    ],
  },
};

export default function Exercicio() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "1");
  const exercicio = exerciciosList.find((e) => e.id === id);
  const conteudo = exerciciosConteudo[id];
  const { completarExercicio, salvarDiario } = useApp();
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [salvo, setSalvo] = useState(false);
  const [respiracaoAtiva, setRespiracaoAtiva] = useState(false);
  const [faseResp, setFaseResp] = useState(0);

  if (!exercicio || !conteudo) {
    return (
      <div className="flex-1 container py-8">
        <p>Exercício não encontrado.</p>
        <Link href="/exercicios">Voltar</Link>
      </div>
    );
  }

  const handleSalvar = () => {
    salvarDiario({
      id: `ex-${id}-${Date.now()}`,
      exercicioId: id,
      conteudo: respostas,
    });
    completarExercicio(id);
    setSalvo(true);
    toast.success("Exercício salvo com sucesso!", {
      description: "Seus dados ficam apenas no seu dispositivo.",
    });
  };

  const fasesResp = ["Inspire", "Segure", "Expire", "Pause"];
  const [contadorResp, setContadorResp] = useState(4);

  // Refs para cleanup do timer de respiração (memory leak fix)
  const respIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const respTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (respIntervalRef.current) clearInterval(respIntervalRef.current);
      if (respTimeoutRef.current) clearTimeout(respTimeoutRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const pararRespiracao = () => {
    if (respIntervalRef.current) clearInterval(respIntervalRef.current);
    if (respTimeoutRef.current) clearTimeout(respTimeoutRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setRespiracaoAtiva(false);
  };

  // Breathing exercise with voice-guided counting (Bloco D)
  const iniciarRespiracao = () => {
    setRespiracaoAtiva(true);
    let fase = 0;
    let contador = 4;
    setFaseResp(0);
    setContadorResp(4);

    // Voice guide
    const falar = (texto: string) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(texto);
        utt.lang = 'pt-BR';
        utt.rate = 0.8;
        const voices = window.speechSynthesis.getVoices();
        const voz = voices.find(v => v.lang === 'pt-BR' || v.lang.startsWith('pt'));
        if (voz) utt.voice = voz;
        window.speechSynthesis.speak(utt);
      }
    };

    falar('Inspire');

    respIntervalRef.current = setInterval(() => {
      contador--;
      if (contador <= 0) {
        fase = (fase + 1) % 4;
        contador = 4;
        setFaseResp(fase);
        falar(fasesResp[fase]);
      }
      setContadorResp(contador);
    }, 1000);

    respTimeoutRef.current = setTimeout(() => {
      if (respIntervalRef.current) clearInterval(respIntervalRef.current);
      setRespiracaoAtiva(false);
      falar('Pronto. Muito bem.');
    }, 64000); // 4 ciclos completos de 4-4-4-4
  };

  const audioText = `Exercício ${id}: ${exercicio.titulo}. ${conteudo.instrucao}. Preencha com calma e honestidade.`;

  // Header data by exercise id
  const headersData: Record<number, {
    objetivo: string;
    porque: string;
    comoFazer: string[];
  }> = {
    1: {
      objetivo: "Identificar em que ponto da sua relação com o jogo você está agora.",
      porque: "Reconhecer o problema é o primeiro passo. Muitas pessoas levam anos sem perceber que cruzaram a linha. Este exercício torna isso visível.",
      comoFazer: ["Leia cada item das três cores", "Marque os que se aplicam hoje", "Observe qual cor tem mais marcações", "Não existe resposta certa — só honesta"],
    },
    2: {
      objetivo: "Mapear o ciclo que leva você a apostar — do gatilho ao recomeço.",
      porque: "O comportamento compulsivo segue um ciclo previsível. Ver no papel facilita identificar onde interrompê-lo. A TCC chama isso de análise funcional.",
      comoFazer: ["Pense na última vez que apostou", "Lembre o que sentiu antes", "Descreva o que aconteceu durante", "Identifique o que te fez recomeçar"],
    },
    3: {
      objetivo: "Criar um plano de ação para os momentos em que a vontade aparecer.",
      porque: "Na crise o cérebro perde capacidade de decidir racionalmente. Um plano pronto, criado num momento tranquilo, aumenta muito a chance de resistir.",
      comoFazer: ["Pense nas situações que disparam a vontade", "Decida agora o que vai fazer", "Anote pessoas de confiança (opcional)", "Guarde — releia quando precisar"],
    },
    4: {
      objetivo: "Ajudar quem está ao lado a entender o Transtorno do Jogo.",
      porque: "Familiares que entendem que é uma condição de saúde conseguem ajudar muito melhor do que com raiva ou silêncio. O apoio familiar aumenta a recuperação.",
      comoFazer: ["Compartilhe com alguém próximo", "Leiam juntos sem pressão", "Conversem sobre o que cada um pode fazer"],
    },
    5: {
      objetivo: "Identificar qual pensamento distorcido mais aparece antes de apostar.",
      porque: "Nomeá-los cria distância entre o pensamento e a ação. Você aprende a questionar antes de agir. É o coração da TCC.",
      comoFazer: ["Releia a lista das 8 distorções", "Pense na última vez que apostou", "Identifique qual distorção estava presente", "Escreva o que seria mais realista"],
    },
    6: {
      objetivo: "Registrar em tempo real os pensamentos quando a vontade de apostar aparece.",
      porque: "Escrever os pensamentos os torna concretos — e concreto é mais fácil de questionar. O diário revela padrões ao longo do tempo.",
      comoFazer: ["Use ao sentir vontade de apostar", "Escreva o que aconteceu antes", "Pergunte: fato ou emoção?", "Escreva um pensamento alternativo"],
    },
    7: {
      objetivo: "Interromper o impulso ancorando a atenção no momento presente.",
      porque: "O impulso dura 15-20 minutos. Esta técnica de mindfulness ocupa a atenção durante esse pico, usando os 5 sentidos para sair do piloto automático.",
      comoFazer: ["Pare onde estiver", "Respire fundo uma vez", "Nomeie 5 coisas visíveis", "Toque 4, ouça 3, perceba 2, sinta 1", "Repita — o impulso passa"],
    },
    8: {
      objetivo: "Ativar o sistema nervoso de calma em menos de 4 minutos.",
      porque: "Quando a vontade surge, o corpo entra em alerta. A respiração controlada ativa o sistema parassimpático — o freio do corpo.",
      comoFazer: ["Inspire — 4 segundos", "Segure — 4 segundos", "Expire — 4 segundos", "Espere 4s. Repita 4 vezes (~3 min)", "Ative o som: a voz conta os segundos"],
    },
    9: {
      objetivo: "Transformar um episódio de aposta em aprendizado sem autopunição.",
      porque: "Um lapso não precisa virar recaída. O que acontece nos 30 min seguintes determina o rumo. Curiosidade — não culpa — revela pontos cegos.",
      comoFazer: ["Preencha logo após o episódio", "Descreva sem julgar — como detetive", "Identifique o gatilho específico", "Decida um passo concreto para hoje"],
    },
    10: {
      objetivo: "Ver em números reais o impacto financeiro das apostas na sua vida.",
      porque: "O cérebro lembra dos ganhos e esquece das perdas. Colocar os números no papel quebra essa ilusão e ativa a parte racional da decisão.",
      comoFazer: ["Preencha com os valores reais que lembrar", "Se não lembrar exatamente, estime", "Calcule o total — não pule esta etapa", "Veja o equivalente em coisas concretas"],
    },
    11: {
      objetivo: "Reunir em um só lugar tudo que você aprendeu sobre si mesmo.",
      porque: "Em momentos de crise a memória falha. Ter tudo registrado funciona como manual de emergência que você mesmo escreveu num momento de lucidez.",
      comoFazer: ["Complete após os exercícios 2, 3 e 9", "Preencha um campo por vez — sem pressa", "Revise e atualize quando aprender algo", "Leia toda vez que sentir vontade de apostar"],
    },
    12: {
      objetivo: "Escrever uma mensagem do seu eu presente para o seu eu futuro.",
      porque: "Em momentos de impulso, ler sua própria voz — com seus motivos e esperanças — pode ser o que faz a diferença.",
      comoFazer: ["Escreva como conversando com você no futuro", "Fale sobre o que quer alcançar", "Não precisa ser perfeito — só honesto", "Guarde e releia quando precisar"],
    },
  };

  const headerData = headersData[id];

  return (
    <PageAudioWrapper pageText={audioText} label="Ouvir exercício">
    <div className="flex-1 container py-8">
      <Link href="/exercicios" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar aos exercícios
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 ${exercicio.cor} rounded-full border-2 border-foreground flex items-center justify-center`}>
              <span className="text-white font-body font-bold text-xs">{exercicio.id}</span>
            </div>
            <span className="font-body text-xs text-muted-foreground uppercase">{exercicio.subtitulo}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl mb-4">{exercicio.titulo}</h1>
        </motion.div>

        {/* ExercicioHeader — Objetivo, Por que, Como fazer */}
        {headerData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 mb-6"
          >
            <div className="card-cordel p-4 bg-[oklch(0.50_0.14_155/0.08)] border-accent">
              <p className="font-body text-xs font-bold text-accent mb-1">🎯 OBJETIVO</p>
              <p className="font-body text-sm">{headerData.objetivo}</p>
            </div>
            <div className="card-cordel p-4 bg-[oklch(0.55_0.14_60/0.08)] border-[oklch(0.55_0.14_60)]">
              <p className="font-body text-xs font-bold mb-1">💡 POR QUE ESTAMOS PROPONDO</p>
              <p className="font-body text-sm">{headerData.porque}</p>
            </div>
            <div className="card-cordel p-4 bg-muted/50">
              <p className="font-body text-xs font-bold mb-2">📋 COMO FAZER</p>
              <ol className="space-y-1">
                {headerData.comoFazer.map((p, i) => (
                  <li key={i} className="font-body text-sm flex gap-2">
                    <span className="font-bold shrink-0 text-accent">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}

        <p className="font-body text-muted-foreground mb-8">{conteudo.instrucao}</p>

        {/* Special content: Breathing exercise */}
        {conteudo.conteudoEspecial === "respiracao" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-cordel p-8 text-center mb-8"
          >
            <div className="relative w-40 h-40 mx-auto mb-6">
              <motion.div
                animate={respiracaoAtiva ? {
                  scale: faseResp === 0 ? [1, 1.3] : faseResp === 1 ? 1.3 : faseResp === 2 ? [1.3, 1] : 1,
                } : {}}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-full h-full rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center"
              >
                <span className="font-body font-bold text-lg text-primary">
                  {respiracaoAtiva ? `${fasesResp[faseResp]}` : "4-4-4-4"}
                </span>
                {respiracaoAtiva && (
                  <span className="font-body text-3xl font-bold text-primary mt-1">{contadorResp}</span>
                )}
              </motion.div>
            </div>
            <p className="font-body text-sm text-muted-foreground mb-4">
              {respiracaoAtiva
                ? `${fasesResp[faseResp]}... ${contadorResp}s`
                : "Inspire 4s → Segure 4s → Expire 4s → Pause 4s"}
            </p>
            <p className="font-body text-xs text-muted-foreground mb-2">
              {respiracaoAtiva ? "A voz vai guiar você" : "Com contagem por voz"}
            </p>
            <Button
              onClick={iniciarRespiracao}
              disabled={respiracaoAtiva}
              className="border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold"
            >
              {respiracaoAtiva ? "Respirando..." : "Iniciar Respiração Guiada"}
            </Button>
          </motion.div>
        )}

        {/* Form Fields */}
        {conteudo.campos && (
          <div className="space-y-5 mb-8">
            {conteudo.campos.map((campo) => (
              <motion.div
                key={campo.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-cordel p-5"
              >
                <label className="block font-body font-semibold text-sm mb-2">
                  {campo.label}
                </label>
                {campo.id === "semaforo" ? (
                  <div className="flex gap-3">
                    {["Verde", "Amarelo", "Vermelho"].map((cor) => (
                      <button
                        key={cor}
                        onClick={() => setRespostas({ ...respostas, [campo.id]: cor })}
                        className={`flex-1 p-3 font-body font-bold text-sm border-2 border-foreground rounded-md transition-all ${
                          respostas[campo.id] === cor
                            ? cor === "Verde" ? "bg-accent text-white" : cor === "Amarelo" ? "bg-[oklch(0.75_0.15_85)] text-foreground" : "bg-destructive text-white"
                            : "bg-muted hover:bg-muted/70"
                        }`}
                      >
                        {cor}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={respostas[campo.id] || ""}
                    onChange={(e) => setRespostas({ ...respostas, [campo.id]: e.target.value })}
                    placeholder={campo.placeholder}
                    rows={campo.id === "carta" ? 8 : 3}
                    className="w-full p-3 font-body text-sm border-2 border-foreground rounded-md bg-background resize-none focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Contacts section when relevant */}
        {conteudo.mostrarContatos && (
          <div className="card-cordel p-4 mb-6 bg-muted">
            <p className="font-body text-xs font-semibold mb-2">Precisa de apoio? (sempre disponível)</p>
            <div className="space-y-1">
              <a href="tel:188" className="flex items-center gap-2 font-body text-sm hover:text-primary transition-colors">
                <Phone className="w-3 h-3" /> CVV — 188 (24h · Gratuito · Sigiloso)
              </a>
              <a href="tel:+551132291615" className="flex items-center gap-2 font-body text-sm hover:text-accent transition-colors">
                <Users className="w-3 h-3" /> JA — (11) 3229-1615
              </a>
            </div>
          </div>
        )}

        {/* Gam-Anon for family exercise */}
        {conteudo.mostrarGamAnon && (
          <div className="card-cordel p-4 mb-6 bg-[oklch(0.50_0.14_155/0.05)]">
            <p className="font-body text-xs font-semibold mb-2">Apoio para familiares:</p>
            <p className="font-body text-sm">
              <strong>Gam-Anon</strong> — Grupo de apoio para familiares de jogadores. Ligue: (11) 3229-1615
            </p>
          </div>
        )}

        {/* Autoexclusão QR for exercise 12 */}
        {id === 12 && (
          <div className="card-cordel p-4 mb-6 bg-primary/5">
            <p className="font-body text-sm text-center">
              Acesse o bloqueio de apostas:{" "}
              <a
                href="https://autoexclusaoapostas.fazenda.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                autoexclusaoapostas.fazenda.gov.br
              </a>
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSalvar}
            size="lg"
            className="flex-1 border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
          >
            {salvo ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {salvo ? "Salvo!" : "Salvar Exercício"}
          </Button>
        </div>

        {salvo && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-sm text-accent text-center mt-4"
          >
            Seus dados ficam salvos apenas no seu dispositivo. Ninguém mais tem acesso.
          </motion.p>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t-2 border-foreground/20">
          {id > 1 && (
            <Link href={`/exercicio/${id - 1}`} className="font-body text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Exercício anterior
            </Link>
          )}
          {id < 12 && (
            <Link href={`/exercicio/${id + 1}`} className="font-body text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 ml-auto">
              Próximo exercício →
            </Link>
          )}
        </div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}
