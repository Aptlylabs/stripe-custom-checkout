"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_subscription_1 = __importDefault(require("../controller/create-subscription"));
const subscriptionRouter = (0, express_1.Router)();
subscriptionRouter.post("/subscription/create", create_subscription_1.default);
exports.default = subscriptionRouter;
//# sourceMappingURL=subscription.js.map