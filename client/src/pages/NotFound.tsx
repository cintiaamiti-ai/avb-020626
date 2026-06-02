import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex-1 flex items-center justify-center container py-16">
      <div className="card-cordel p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-secondary rounded-full border-3 border-foreground flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-secondary-foreground" />
          </div>
        </div>

        <h1 className="text-4xl mb-2">404</h1>
        <h2 className="text-lg font-body font-semibold text-foreground mb-4">
          Página não encontrada
        </h2>
        <p className="font-body text-sm text-muted-foreground mb-8">
          A página que você procura não existe ou foi movida.
        </p>

        <Button
          onClick={() => setLocation("/")}
          className="border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Button>
      </div>
    </div>
  );
}
