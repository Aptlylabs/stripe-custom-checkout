import { Grid, Stack, Typography } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "./utils/constants";
import PaymentForm from "./PaymentForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const location = useLocation();

  const { paymentClientSecret } = location.state || {};

  return (
    <Grid container spacing={3} flexDirection="row" height={1}>
      <Grid item xs={12} sm={12} md={7}>
        <Stack spacing={2} width={1}>
          <Stack spacing={1} width={1}>
            <Typography
              variant="h5"
              color={(theme) => theme.palette.common.white}
              fontWeight={800}
            >
              Checkout
            </Typography>
          </Stack>
          <Stack pl={10}>
            <Elements stripe={stripePromise}>
              <PaymentForm paymentClientSecret={paymentClientSecret} />
            </Elements>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Checkout;
