"use client";

import { useEffect, useState } from "react";
import { Clock, Flame, ChevronDown, ChevronUp } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ScoreRing from "@/components/ScoreRing";
import SuggestionCard from "@/components/SuggestionCard";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { Analysis } from "@/types";
import Link from "next/link";

export default function HistoriquePage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const { data } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setAnalyses(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex min-h-dvh flex-col pb-20">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <Clock size={22} className="text-accent-purple" />
          <span className="text-lg font-bold">Historique</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="shimmer-bg animate-shimmer h-20 rounded-2xl"
              />
            ))}
          </div>
        )}

        {!loading && isLoggedIn === false && (
          <div className="py-16 text-center">
            <p className="mb-2 text-5xl">🔒</p>
            <h2 className="mb-2 text-lg font-bold">Connecte-toi</h2>
            <p className="mb-6 text-sm text-text-secondary">
              Crée un compte pour sauvegarder tes analyses
            </p>
            <Link
              href="/connexion"
              className="btn-gradient inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              Se connecter
            </Link>
          </div>
        )}

        {!loading && isLoggedIn && analyses.length === 0 && (
          <div className="py-16 text-center">
            <p className="mb-2 text-5xl">📭</p>
            <h2 className="mb-2 text-lg font-bold">Rien pour l&apos;instant</h2>
            <p className="mb-6 text-sm text-text-secondary">
              Tes futures analyses apparaîtront ici
            </p>
            <Link
              href="/analyse"
              className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Flame size={16} />
              Analyser une conversation
            </Link>
          </div>
        )}

        {!loading && analyses.length > 0 && (
          <div className="space-y-3">
            {analyses.map((a) => {
              const isExpanded = expandedId === a.id;
              return (
                <div
                  key={a.id}
                  className="glass-card overflow-hidden transition"
                >
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : a.id)
                    }
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-medium">
                        {a.conversation_text || "Analyse"}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {formatDate(a.created_at)}
                      </p>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-accent-pink">
                      {a.score}/10
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-text-muted" />
                    ) : (
                      <ChevronDown size={16} className="text-text-muted" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-white/5 px-4 pb-4 pt-3">
                      <div className="mb-4 flex justify-center">
                        <ScoreRing score={a.score} size={120} />
                      </div>
                      <p className="mb-4 text-sm text-text-secondary">
                        {a.explanation}
                      </p>
                      <div className="space-y-2">
                        {a.suggestions.map((s) => (
                          <SuggestionCard
                            key={s.tone}
                            tone={s.tone}
                            toneLabel={s.tone_label}
                            toneEmoji={s.tone_emoji}
                            message={s.message}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
