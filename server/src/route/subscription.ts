import { Router } from "express";
import CreateSubscription from "../controller/create-subscription";

const subscriptionRouter = Router();

subscriptionRouter.post("/subscription/create", CreateSubscription);
export default subscriptionRouter;
