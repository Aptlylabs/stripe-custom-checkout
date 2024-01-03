import { Router, raw } from "express";
import StripeWebhook from "../controller/stripe-webhook";

const webhookRouter = Router();
webhookRouter.post(
  "/stripe/",
  raw({ type: "application/json" }),
  StripeWebhook
);
export default webhookRouter;
