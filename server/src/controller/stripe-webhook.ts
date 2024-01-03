import Stripe from "stripe";
import { STRIPE_SECRET_KEY, WEB_HOOK_SECRET_KEY } from "../constants";
import { NextFunction, Request, Response } from "express";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
const StripeWebhook = async (req: any, res: Response, next: NextFunction) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (WEB_HOOK_SECRET_KEY) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        WEB_HOOK_SECRET_KEY
      );
    } catch (err) {
      console.log(err, `⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  try {
    if (eventType === "payment_intent.succeeded") {
      console.log(data, "data");
    }
  } catch (error) {
    next(error);
  }
};
export default StripeWebhook;
