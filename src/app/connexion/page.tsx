"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Flame, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionContent />
    </Suspense>
  );
}

function ConnexionContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/analyse";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${redirect}`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirect}`,
      },
    });
  };

  if (sent) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <p className="mb-3 text-5xl">📬</p>
          <h1 className="mb-2 text-2xl font-bold">Check tes mails</h1>
          <p className="mb-6 text-sm text-text-secondary">
            On t&apos;a envoyé un lien magique à{" "}
            <strong className="text-text-primary">{email}</strong>
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-accent-pink"
          >
            Utiliser un autre email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Flame size={40} className="mx-auto mb-3 text-accent-pink" />
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Connecte-toi pour sauvegarder tes analyses
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-bg-card py-3.5 text-sm font-semibold transition hover:bg-white/5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuer avec Google
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-text-muted">ou par email</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email */}
        <form onSubmit={handleEmail} className="space-y-3">
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
              className="w-full rounded-xl border border-white/10 bg-bg-card py-3.5 pl-10 pr-4 text-sm outline-none transition focus:border-accent-pink/50"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Recevoir le lien de connexion"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          En continuant, tu confirmes avoir 18 ans et acceptes nos{" "}
          <Link href="/cgv" className="text-accent-pink underline">
            CGV
          </Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" className="text-accent-pink underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
