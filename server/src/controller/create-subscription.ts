import { STRIPE_SECRET_KEY } from "../constants";
import { NextFunction, Request, Response } from "express-serve-static-core";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const CreateSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { priceId, email } = req.body;

  try {
    const customer = await stripe.customers.create({ email });
    const customerId = customer.id;

    const subscription = (await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    })) as any;
    const id = subscription.id;
    const clientSecret =
      subscription.latest_invoice.payment_intent.client_secret;

    res.status(200).json({
      message: "Partial Subscription created successfully",
      clientSecret,
      id,
    });
  } catch (error) {
    next(error);
  }
};

export default CreateSubscription;
