"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(constants_1.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});
const CreateSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { priceId, email } = req.body;
    try {
        const customer = yield stripe.customers.create({ email });
        const customerId = customer.id;
        const subscription = (yield stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: "default_incomplete",
            payment_settings: { save_default_payment_method: "on_subscription" },
            expand: ["latest_invoice.payment_intent"],
        }));
        const id = subscription.id;
        const clientSecret = subscription.latest_invoice.payment_intent.client_secret;
        res.status(200).json({
            message: "Partial Subscription created successfully",
            clientSecret,
            id,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = CreateSubscription;
//# sourceMappingURL=create-subscription.js.map