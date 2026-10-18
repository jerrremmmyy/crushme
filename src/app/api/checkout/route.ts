import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Non connecté" }, { status: 401 });
    }

    const { plan } = await request.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    const priceId =
      plan === "monthly"
        ? process.env.STRIPE_MONTHLY_PRICE_ID!
        : process.env.STRIPE_TRIAL_PRICE_ID!;

    const sessionConfig: Record<string, unknown> = {
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/analyse?success=true`,
      cancel_url: `${appUrl}/analyse?canceled=true`,
      payment_method_types: ["card"],
      locale: "fr",
      allow_promotion_codes: true,
      metadata: { user_id: user.id, plan },
    };

    if (plan === "trial") {
      (sessionConfig as Record<string, unknown>).subscription_data = {
        trial_period_days: 3,
        metadata: { user_id: user.id, plan: "trial" },
      };
    }

    const session = await stripe.checkout.sessions.create(
      sessionConfig as Parameters<typeof stripe.checkout.sessions.create>[0]
    );

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Erreur Stripe" }, { status: 500 });
  }
}
