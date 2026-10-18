import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): string {
  const item = subscription.items.data[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000).toISOString();
  }
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return Response.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan: session.metadata?.plan || "trial",
            current_period_end: getSubscriptionPeriodEnd(subscription),
          },
          { onConflict: "user_id" }
        );
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: existingSub } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (existingSub) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: subscription.status,
              current_period_end: getSubscriptionPeriodEnd(subscription),
            })
            .eq("user_id", existingSub.user_id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json({ error: "Erreur traitement" }, { status: 500 });
  }

  return Response.json({ received: true });
}
