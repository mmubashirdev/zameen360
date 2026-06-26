const Stripe = require("stripe");
const prisma = require("../../../configs/prisma");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-05-27.dahlia",
});

const FEATURED_PLANS = {
  basic: {
    name: "Basic Boost",
    description: "Feature you property for 7 days",
    amount: 1000*100,
    duration: 7,
  },

  premium: {
    name: "Premium Boost",
    description: "Feature your property for 15 days",
    amount: 2500*100,
    duration: 15,
  },
  elite: {
    name: "Elite Boost",
    description: "Feature your property for 30 days",
    amount: 5000*100,
    duration: 30,
  },
};

exports.createCheckoutSession = async ({ propertyId, userId, plan }) => {
  if (!FEATURED_PLANS[plan]) {
    throw new Error(`Invalid plan: ${plan}`);
  }
  const planConfig = FEATURED_PLANS[plan];

  const property = await prisma.property.findUnique({
    where: {
      id: parseInt(propertyId, 10),
    },
  });

  if (!property || property.userId !== userId) {
    throw new Error("Property not found");
  }

  console.log(planConfig);
  console.log(planConfig.amount)*100;
  console.log({
    currency: "pkr",
    unit_amount: planConfig.amount*100,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: planConfig.name,
            description: `${planConfig.description} - Property: ${property.title}`,
          },
          unit_amount: planConfig.amount*100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      propertyId: propertyId.toString(),
      userId: userId.toString(),
      plan,
      duration: planConfig.duration.toString(),
    },
    success_url: `${process.env.Client_URL}/property/${propertyId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.Client_URL}/property/${propertyId}?payment=cancelled`,
  });

  await prisma.payment.create({
    data: {
      userId,
      propertyId,
      stripeSessionId: session.id,
      amount: planConfig.amount*100,
      currency: "pkr",
      status: "pending",
      plan,
      duration: planConfig.duration,
    },
  });
  return { url: session.url, sessionId: session.id };
};

exports.handleWebhookEvent = async (event) => {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "checkout.session.expired":
      await handleCheckoutExpired(event.data.object);
      break;
    case "payment_intent.payment_failed":
      console.warn("Payment failed: ", event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

async function handleCheckoutCompleted(session) {
  const { propertyId, plan, duration } = session.metadata;
  const durationDays = parseInt(duration, 10);
  const featuredUntil = new Date();
  featuredUntil.setDate(featuredUntil.getDate() + durationDays);

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (payment?.status === "succeeded") {
      console.log(
        `Ignoring webhook as session ${session.id} was already processed.`,
      );
      return;
    }
    if (!payment) {
      throw new Error(`Payment record not found for session ${session.id}`);
    }
    await tx.payment.update({
      where: { stripeSessionId: session.id },

      data: {
        status: "succeeded",
        stripePaymentIntentId: session.payment_intent,
      },
    });

    await tx.property.update({
      where: { id: parseInt(propertyId, 10) },
      data: {
        isFeatured: true,
        featuredUntil,
        featuredPlan: plan,
      },
    });
    console.log(
      `Property ${propertyId} featured until ${featuredUntil.toISOString()}`,
    );
  });
}

async function handleCheckoutExpired(session) {
  await prisma.payment.update({
    where: {
      stripeSessionId: session.id,
    },
    data: {
      status: "failed",
    },
  });
}

exports.getUserPayments = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      property: { select: { id: true, title: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.verifySession = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

exports.FEATURED_PLANS = FEATURED_PLANS;
