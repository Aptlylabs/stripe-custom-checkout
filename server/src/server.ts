import express from "express";
import cors from "cors";
import http from "http";
import router from "./route";

const app = express();
const server = new http.Server(app);

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req: any, res, buf) {
      if (req.originalUrl.includes("/webhook")) {
        console.log(req.originalUrl);

        req.rawBody = buf.toString();
      }
    },
  })
);

app.use("/", router);

server.listen("5000", () => {
  console.log(`server running on port ${"5000"}`);
});
