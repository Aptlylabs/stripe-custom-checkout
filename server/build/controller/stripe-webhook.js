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
const stripe_1 = __importDefault(require("stripe"));
const constants_1 = require("../constants");
const stripe = new stripe_1.default(constants_1.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});
const StripeWebhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (constants_1.WEB_HOOK_SECRET_KEY) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(req.rawBody, signature, constants_1.WEB_HOOK_SECRET_KEY);
        }
        catch (err) {
            console.log(err, `⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data;
        eventType = event.type;
    }
    else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }
    try {
        if (eventType === "payment_intent.succeeded") {
            console.log(data, "data");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = StripeWebhook;
//# sourceMappingURL=stripe-webhook.js.map