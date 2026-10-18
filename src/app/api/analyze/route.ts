import { NextRequest } from "next/server";
import { analyzeScreenshot, regenerateSuggestion } from "@/lib/anthropic";
import { createSupabaseServer } from "@/lib/supabase-server";

const MAX_DAILY_ANALYSES = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mediaType, regenerate, conversationText, tone } = body;

    if (regenerate) {
      if (!conversationText || !tone) {
        return Response.json(
          { error: "Paramètres manquants" },
          { status: 400 }
        );
      }
      const result = await regenerateSuggestion(conversationText, tone);
      return Response.json(result);
    }

    if (!image || !mediaType) {
      return Response.json({ error: "Image manquante" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isSubscribed = false;
    let isFreeAnalysis = false;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("free_analysis_used")
        .eq("id", user.id)
        .single();

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .single();

      isSubscribed = !!subscription;

      if (!isSubscribed && !profile?.free_analysis_used) {
        isFreeAnalysis = true;
      } else if (!isSubscribed) {
        return Response.json(
          { error: "Abonnement requis", code: "SUBSCRIPTION_REQUIRED" },
          { status: 403 }
        );
      }

      if (isSubscribed) {
        const today = new Date().toISOString().split("T")[0];
        const { data: usage } = await supabase
          .from("usage_limits")
          .select("count")
          .eq("user_id", user.id)
          .eq("date", today)
          .single();

        if (usage && usage.count >= MAX_DAILY_ANALYSES) {
          return Response.json(
            {
              error: `Limite de ${MAX_DAILY_ANALYSES} analyses par jour atteinte. Reviens demain !`,
              code: "DAILY_LIMIT",
            },
            { status: 429 }
          );
        }
      }
    } else {
      isFreeAnalysis = true;
    }

    const result = await analyzeScreenshot(image, mediaType);

    if (result.refused) {
      return Response.json({
        ...result,
        isFreeAnalysis: false,
      });
    }

    if (user) {
      if (isFreeAnalysis) {
        await supabase
          .from("profiles")
          .update({ free_analysis_used: true })
          .eq("id", user.id);
      }

      await supabase.from("analyses").insert({
        user_id: user.id,
        score: result.score,
        explanation: result.explanation,
        conversation_text: result.conversation_text,
        suggestions: result.suggestions,
      });

      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabase
        .from("usage_limits")
        .select("count")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (existing) {
        await supabase
          .from("usage_limits")
          .update({ count: existing.count + 1 })
          .eq("user_id", user.id)
          .eq("date", today);
      } else {
        await supabase
          .from("usage_limits")
          .insert({ user_id: user.id, date: today, count: 1 });
      }
    }

    return Response.json({
      ...result,
      isFreeAnalysis,
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return Response.json(
      { error: "Erreur lors de l'analyse. Réessaie." },
      { status: 500 }
    );
  }
}
