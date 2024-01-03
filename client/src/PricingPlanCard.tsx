import { Card, Button, Typography, Stack, CardProps } from "@mui/material";
import axios from "../src/utils/axios";
import {
  STRIPE_MONTHLY_PREMIUM_PLAN_ID,
  STRIPE_MONTHLY_STARTER_PLAN_ID,
} from "./utils/constants";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  card: {
    subscription: string;
    price: number;
    caption?: string;
    labelAction: string;
    lists: {
      text: string;
      isAvailable: boolean;
    }[];
  };
  index: number;
}

export enum SubscriptionType {
  FREE = "FREE",
  STARTER = "STARTER",
  PREMIUM = "PREMIUM",
}
export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  RENEWED = "RENEWED",
}

export default function PricingPlanCard({ card, index, sx, ...other }: Props) {
  const navigate = useNavigate();
  const { subscription, price, caption, lists } = card;

  const handleCreateSubscription = async (subscription: string) => {
    try {
      const response = await axios.post("/admin/subscription/create", {
        priceId:
          subscription === SubscriptionType.STARTER
            ? STRIPE_MONTHLY_STARTER_PLAN_ID
            : STRIPE_MONTHLY_PREMIUM_PLAN_ID,
        email: "test@gmail.com",
      });

      console.log(response, "resp");

      navigate("/checkout", {
        state: {
          paymentClientSecret: response.data.clientSecret as string,
        },
      });
    } catch (error) {
      console.error(error, "@error::Index::create-subscription");
    }
  };

  return (
    <>
      <Card
        sx={{
          p: 5,
          ...sx,
        }}
        {...other}
      >
        <Typography variant="overline" sx={{ color: "text.secondary" }}>
          {subscription}
        </Typography>

        <Stack spacing={1} direction="row" sx={{ my: 2 }}>
          {(index === 1 || index === 2) && (
            <Typography variant="h5">$</Typography>
          )}

          <Typography variant="h2">{price === 0 ? "Free" : price}</Typography>

          {(index === 1 || index === 2) && (
            <Typography
              component="span"
              sx={{ alignSelf: "center", color: "text.secondary" }}
            >
              /mo
            </Typography>
          )}
        </Stack>

        <Typography
          variant="caption"
          sx={{
            color: "info",
            textTransform: "capitalize",
          }}
        >
          {caption}
        </Typography>

        <Stack component="ul" spacing={2} sx={{ p: 0, my: 3 }}>
          {lists.map((item) => (
            <Stack
              key={item.text}
              component="li"
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                typography: "body2",
                color: item.isAvailable ? "info" : "text.disabled",
              }}
            >
              <Typography variant="body2">{item.text}</Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          size="large"
          variant="contained"
          color="secondary"
          disabled={index === 0}
          onClick={() => {
            handleCreateSubscription(subscription);
          }}
        >
          Choose
        </Button>
      </Card>
    </>
  );
}
