const Stripe = require("stripe");
const paymentService = require("../services/payment.service");

let stripeClient;

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

exports.createCheckout = async (req, res) => {
  try {
    const { propertyId, plan } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication Required",
      });
    }
    if (!propertyId || !plan) {
      return res.status(400).json({
        success: false,
        message: "propertyId and plan is required",
      });
    }
    const result = await paymentService.createCheckoutSession({
      propertyId: parseInt(propertyId, 10),
      userId,
      plan,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    console.log("Create checkout error: ", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create checkout session",
    });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = getStripeClient().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed: ", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  console.log(`Stripe event received: ${event.type}`);
  try {
    await paymentService.handleWebhookEvent(event);
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error: ", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPlans = async (_req, res) => {
  console.log("Plans endpoint hit");
  res.json({
    success: true,
    plans: paymentService.FEATURED_PLANS,
  });
};

exports.getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorizaed" });
    }
    const payments = await paymentService.getUserPayments(userId);
    const serialized = payments.map((p) => ({
      ...p,
      amount: p.amount.toString(),
    }));
    res.json({ success: true, data: serialized });
  } catch (error) {
    console.error("Get payments error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const session = await paymentService.verifySession(req.params.sessionId);
    if (session.metadata.userId !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    res.json({
      success: true,
      data: {
        status: session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
