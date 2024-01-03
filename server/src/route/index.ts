import { Router } from "express";
import subscriptionRouter from "./subscription";
import webhookRouter from "./webhook";

const router = Router();

router.get("/", (req, res) =>
  res.status(200).json({ message: "Welcome to stripe-demo-project" })
);
router.use("/admin", subscriptionRouter);

router.use("/webhook", webhookRouter);

export default router;
