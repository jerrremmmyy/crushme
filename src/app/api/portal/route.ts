import { stripe } from "@/lib/stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Non connecté" }, { status: 401 });
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return Response.json({ error: "Pas d'abonnement" }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/compte`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return Response.json({ error: "Erreur" }, { status: 500 });
  }
}
