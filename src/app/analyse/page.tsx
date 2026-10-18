"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Flame, RotateCcw } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import ScoreRing from "@/components/ScoreRing";
import SuggestionCard from "@/components/SuggestionCard";
import PaywallOverlay from "@/components/PaywallOverlay";
import BottomNav from "@/components/BottomNav";
import type { AnalysisResult, Suggestion } from "@/types";

export default function AnalysePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isFreeAnalysis, setIsFreeAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refused, setRefused] = useState<string | null>(null);
  const [regeneratingTone, setRegeneratingTone] = useState<string | null>(null);

  const handleAnalyze = useCallback(
    async (base64: string, mediaType: string) => {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setRefused(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mediaType }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.code === "SUBSCRIPTION_REQUIRED") {
            setError("Tu as déjà utilisé ton analyse gratuite. Abonne-toi pour continuer !");
            return;
          }
          setError(data.error || "Erreur lors de l'analyse");
          return;
        }

        if (data.refused) {
          setRefused(data.refusal_reason);
          return;
        }

        setResult(data);
        setIsFreeAnalysis(data.isFreeAnalysis);
      } catch {
        setError("Erreur réseau. Vérifie ta connexion.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleRegenerate = useCallback(
    async (tone: string) => {
      if (!result) return;
      setRegeneratingTone(tone);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regenerate: true,
            conversationText: result.conversation_text,
            tone,
          }),
        });

        const data = await res.json();
        if (data.message) {
          setResult((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              suggestions: prev.suggestions.map((s: Suggestion) =>
                s.tone === tone ? { ...s, message: data.message } : s
              ),
            };
          });
        }
      } catch {
        // Silent fail for regeneration
      } finally {
        setRegeneratingTone(null);
      }
    },
    [result]
  );

  const handleSubscribe = useCallback(async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "trial" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        window.location.href = "/connexion?redirect=/analyse";
      }
    } catch {
      alert("Erreur. Réessaie.");
    }
  }, []);

  const reset = () => {
    setResult(null);
    setError(null);
    setRefused(null);
    setIsFreeAnalysis(false);
  };

  return (
    <div className="flex min-h-dvh flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {result && (
              <button onClick={reset} className="text-text-muted">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Flame size={22} className="text-accent-pink" />
              <span className="text-lg font-bold">CrushMe</span>
            </div>
          </div>
          {result && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-full bg-bg-elevated px-3 py-1.5 text-sm font-medium text-text-secondary transition hover:bg-white/10"
            >
              <RotateCcw size={14} />
              Nouvelle
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6">
        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-center">
            <p className="text-sm text-red-400">{error}</p>
            {error.includes("Abonne-toi") && (
              <button
                onClick={handleSubscribe}
                className="btn-gradient mt-3 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
              >
                S&apos;abonner
              </button>
            )}
          </div>
        )}

        {/* Refused state */}
        {refused && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-center">
            <p className="mb-2 text-3xl">🚫</p>
            <p className="text-sm leading-relaxed text-amber-200">
              {refused}
            </p>
            <button
              onClick={reset}
              className="mt-4 rounded-xl bg-bg-elevated px-5 py-2.5 text-sm font-semibold"
            >
              Essayer une autre image
            </button>
          </div>
        )}

        {/* Upload or Results */}
        {!result && !refused && (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Analyse ta conversation</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Envoie un screenshot, l&apos;IA fait le reste
              </p>
            </div>
            <ImageUpload
              onImageSelected={handleAnalyze}
              isLoading={isLoading}
            />
            {!isLoading && (
              <p className="mt-4 text-center text-xs text-text-muted">
                Ton image n&apos;est jamais stockée · Analyse instantanée
              </p>
            )}
          </>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Score */}
            <div className="animate-fade-up flex flex-col items-center py-2">
              <ScoreRing score={result.score} />
            </div>

            {/* Explanation */}
            <div className="animate-fade-up-delay glass-card p-4">
              <p className="text-[15px] leading-relaxed text-text-secondary">
                {result.explanation}
              </p>
            </div>

            {/* Suggestions */}
            <div className="animate-fade-up-delay-2 space-y-3">
              <h2 className="text-base font-semibold">
                Réponds avec style ✨
              </h2>

              {result.suggestions.map((s: Suggestion, i: number) => (
                <div key={s.tone} className="relative">
                  <SuggestionCard
                    tone={s.tone}
                    toneLabel={s.tone_label}
                    toneEmoji={s.tone_emoji}
                    message={s.message}
                    blurred={isFreeAnalysis && i >= 1}
                    onRegenerate={
                      !isFreeAnalysis ? handleRegenerate : undefined
                    }
                    isRegenerating={regeneratingTone === s.tone}
                  />
                </div>
              ))}

              {/* Paywall for free analysis */}
              {isFreeAnalysis && (
                <PaywallOverlay onSubscribe={handleSubscribe} />
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
