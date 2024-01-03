"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const route_1 = __importDefault(require("./route"));
const app = (0, express_1.default)();
const server = new http_1.default.Server(app);
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
        if (req.originalUrl.includes("/webhook")) {
            console.log(req.originalUrl);
            req.rawBody = buf.toString();
        }
    },
}));
app.use("/", route_1.default);
server.listen("5000", () => {
    console.log(`server running on port ${"5000"}`);
});
//# sourceMappingURL=server.js.map