import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  console.log("Stripe webhook received");
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event);
      case "customer.subscription.deleted":
        return handleSubscriptionDeleted(event);

      default:
        return NextResponse.json({
          status: 400,
          error: "Unhandled event type",
        });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  try {
    await fetchMutation(api.user.subscribeToNitro, {
      email: session.customer_details?.email || undefined,
      customerId: session.customer as string,
      event: "subscribe",
    });

    return NextResponse.json({
      status: 200,
      message: "Subscription successful",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  try {
    await fetchMutation(api.user.subscribeToNitro, {
      customerId,
      event: "unsubscribe",
    });

    return NextResponse.json({
      status: 200,
      message: "Unsubscribed from nitro",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to unsubscribe from nitro" },
      { status: 500 }
    );
  }
}
