"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_webhook_1 = __importDefault(require("../controller/stripe-webhook"));
const webhookRouter = (0, express_1.Router)();
webhookRouter.post("/stripe/", (0, express_1.raw)({ type: "application/json" }), stripe_webhook_1.default);
exports.default = webhookRouter;
//# sourceMappingURL=webhook.js.map