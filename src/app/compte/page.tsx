"use client";

import { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  LogOut,
  Shield,
  ExternalLink,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

interface UserData {
  email: string;
  subscription: {
    status: string;
    plan: string;
    current_period_end: string;
  } | null;
}

export default function ComptePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowser();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, plan, current_period_end")
        .eq("user_id", authUser.id)
        .single();

      setUser({
        email: authUser.email || "",
        subscription: sub,
      });
      setLoading(false);
    };
    load();
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Erreur. Réessaie.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const statusLabel: Record<string, { text: string; color: string }> = {
    active: { text: "Actif", color: "text-green-400 bg-green-500/10" },
    trialing: { text: "Essai", color: "text-blue-400 bg-blue-500/10" },
    canceled: { text: "Résilié", color: "text-red-400 bg-red-500/10" },
    past_due: { text: "Impayé", color: "text-amber-400 bg-amber-500/10" },
  };

  return (
    <div className="flex min-h-dvh flex-col pb-20">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <User size={22} className="text-accent-blue" />
          <span className="text-lg font-bold">Compte</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="shimmer-bg animate-shimmer h-16 rounded-2xl"
              />
            ))}
          </div>
        )}

        {!loading && !user && (
          <div className="py-16 text-center">
            <p className="mb-2 text-5xl">👤</p>
            <h2 className="mb-2 text-lg font-bold">Pas encore de compte</h2>
            <p className="mb-6 text-sm text-text-secondary">
              Connecte-toi pour gérer ton abonnement
            </p>
            <Link
              href="/connexion"
              className="btn-gradient inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              Se connecter
            </Link>
          </div>
        )}

        {!loading && user && (
          <div className="space-y-4">
            {/* Profile */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-purple/20 text-xl font-bold text-accent-purple">
                  {user.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-xs text-text-muted">Membre</p>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="glass-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-accent-pink" />
                <span className="font-semibold">Abonnement</span>
              </div>

              {user.subscription ? (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusLabel[user.subscription.status]?.color || "text-text-muted bg-white/5"}`}
                    >
                      {statusLabel[user.subscription.status]?.text ||
                        user.subscription.status}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {user.subscription.plan === "monthly"
                        ? "Mensuel · 25€/mois"
                        : "Hebdo · 10€/sem"}
                    </span>
                  </div>

                  {user.subscription.current_period_end && (
                    <p className="mb-3 text-xs text-text-muted">
                      Prochain renouvellement :{" "}
                      {new Date(
                        user.subscription.current_period_end
                      ).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-bg-elevated py-3 text-sm font-semibold transition hover:bg-white/5 disabled:opacity-50"
                  >
                    <ExternalLink size={14} />
                    {portalLoading
                      ? "Chargement..."
                      : "Gérer / Résilier mon abonnement"}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-sm text-text-secondary">
                    Pas d&apos;abonnement actif
                  </p>
                  <Link
                    href="/analyse"
                    className="btn-gradient flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white"
                  >
                    S&apos;abonner
                  </Link>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href="/confidentialite"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-bg-card p-4 transition hover:bg-white/5"
              >
                <Shield size={18} className="text-text-muted" />
                <span className="text-sm">Politique de confidentialité</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl border border-red-500/10 bg-bg-card p-4 text-red-400 transition hover:bg-red-500/5"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
