import {
  Alert,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import countries from "./assets/data/country_state_city_list.json";
import { StripeElementChangeEvent } from "@stripe/stripe-js";
import { LoadingButton } from "@mui/lab";

interface ICountryStateCity {
  name: string;
  flag: string;
  code: string;
  states: {
    name: string;
    code: string;
    cities: {
      name: string;
    }[];
  }[];
}

interface PaymentFormError {
  card?: string;
  expiry?: string;
  cvc?: string;
  address?: string;
  country?: string;
  zipcode?: string;
  payment?: string;
}

interface AdditionalBillingDetails {
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

const paymentFormErrorInitialValues = {
  card: "",
  expiry: "",
  cvc: "",
  address: "",
  country: "",
  zipcode: "",
  payment: "",
};

const additionalBillingDetailsInitialValues = {
  address: "",
  country: "",
  state: "",
  city: "",
  zipcode: "",
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#fff",
      fontSize: "16px",
      fontFamily: '"Poppins", sans-serif',
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#BF314C",
      iconColor: "#BF314C",
    },
  },
};
interface IProp {
  paymentClientSecret: string;
}

export default function PaymentForm(props: IProp) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { paymentClientSecret } = props;

  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [additionalBillingDetails, setAdditionalBillingDetails] =
    useState<AdditionalBillingDetails>(additionalBillingDetailsInitialValues);
  const [error, setError] = useState<PaymentFormError | null>(
    paymentFormErrorInitialValues
  );
  const [showError, setShowError] = useState<boolean>(false);

  const validateFields = () => {
    return (
      !stripe ||
      !elements?.getElement(CardNumberElement) ||
      !additionalBillingDetails.address ||
      !additionalBillingDetails.country ||
      !additionalBillingDetails.zipcode
    );
  };

  const checkAndClearErrors = () => {
    if (
      stripe &&
      elements?.getElement(CardNumberElement) &&
      additionalBillingDetails.address &&
      additionalBillingDetails.country &&
      additionalBillingDetails.zipcode
    ) {
      setError(paymentFormErrorInitialValues); // Reset to initial state
      setShowError(false); // Hide error messages
    }
  };

  const states: ICountryStateCity["states"] =
    (countries as ICountryStateCity[]).find(
      (country) => country.code === additionalBillingDetails.country
    )?.states || [];

  const handleChangeStripeFields = (event: StripeElementChangeEvent) => {
    if (
      event.error?.code === "invalid_number" ||
      event.error?.code === "incomplete_number"
    )
      setError((prev) => ({ ...prev, card: event.error?.message }));
    else if (
      event.error?.code === "incomplete_expiry" ||
      event.error?.code === "invalid_expiry_year_past" ||
      event.error?.code === "invalid_expiry_month_past"
    )
      setError((prev) => ({ ...prev, expiry: event.error?.message }));
    else if (event.error?.code === "incomplete_cvc")
      setError((prev) => ({ ...prev, cvc: event.error?.message }));
    else setError(null);

    checkAndClearErrors();
  };

  const handleChangeAddressFields = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setAdditionalBillingDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    checkAndClearErrors();
  };

  const handlePaymentSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (validateFields()) {
      setShowError(true);
      return;
    }

    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded.");
      return;
    }

    setPaymentLoading(true);

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      console.error("Card element not found");
      return;
    }

    try {
      const response = await stripe.confirmCardPayment(paymentClientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            address: {
              line1: additionalBillingDetails.address,
              country: additionalBillingDetails.country,
              state: additionalBillingDetails.state,
              city: additionalBillingDetails.city,
              postal_code: additionalBillingDetails.zipcode,
            },
          },
        },
      });

      if (response?.paymentIntent?.status === "succeeded") {
        navigate("/success");
      } else {
        const errorMessage = response?.error?.message || "Payment failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      const err = error as Error;
      console.error("Payment processing failed", err);
      setError((prev) => ({ ...prev, payment: err.message }));
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    checkAndClearErrors();
  }, [additionalBillingDetails, stripe, elements]);

  return (
    <>
      <form onSubmit={handlePaymentSubmit}>
        {elements && (
          <Grid container spacing={2}>
            {error?.payment && (
              <Grid item xs={12}>
                <Alert severity="error"> {error.payment}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <InputLabel>
                Card Information{" "}
                <Typography
                  variant="h6"
                  lineHeight={1}
                  color={(theme) => theme.palette.error.main}
                >
                  *
                </Typography>
              </InputLabel>
              <CardNumberElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleChangeStripeFields}
              />
              {error?.card && (
                <Typography
                  mt={0.5}
                  variant="body2"
                  color={(theme) => theme.palette.error.main}
                  id="card-errors"
                  role="alert"
                >
                  {error?.card}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <InputLabel>
                Expiry date{" "}
                <Typography
                  variant="h6"
                  lineHeight={1}
                  color={(theme) => theme.palette.error.main}
                >
                  *
                </Typography>
              </InputLabel>
              <CardExpiryElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleChangeStripeFields}
              />
              {error?.expiry && (
                <Typography
                  mt={0.5}
                  variant="body2"
                  color={(theme) => theme.palette.error.main}
                  id="card-expiry-errors"
                  role="alert"
                >
                  {error?.expiry}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <InputLabel>
                CVC{" "}
                <Typography
                  variant="h6"
                  lineHeight={1}
                  color={(theme) => theme.palette.error.main}
                >
                  *
                </Typography>
              </InputLabel>
              <CardCvcElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleChangeStripeFields}
              />
              {error?.cvc && (
                <Typography
                  mt={0.5}
                  variant="body2"
                  color={(theme) => theme.palette.error.main}
                  id="card-expiry-errors"
                  role="alert"
                >
                  {error?.cvc}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <InputLabel>
                Address{" "}
                <Typography
                  variant="h6"
                  lineHeight={1}
                  color={(theme) => theme.palette.error.main}
                >
                  *
                </Typography>
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-input": {
                    padding: 1,
                    color: "#fff",
                  },
                }}
                style={{
                  backgroundColor: "#2e2e2e",
                  border: "1px solid #666666",
                  borderRadius: "6px",
                }}
                fullWidth
                variant="outlined"
                name="address"
                value={additionalBillingDetails.address}
                onChange={handleChangeAddressFields}
                placeholder="Enter Address"
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>
                Country{" "}
                <Typography
                  variant="h6"
                  lineHeight={1}
                  color={(theme) => theme.palette.error.main}
                >
                  *
                </Typography>
              </InputLabel>
              <Select
                sx={{ "& .MuiOutlinedInput-input": { padding: 1 } }}
                style={{
                  backgroundColor: "#2e2e2e",
                  border: "1px solid #666666",
                  borderRadius: "6px",
                }}
                fullWidth
                variant="outlined"
                name="country"
                displayEmpty
                value={additionalBillingDetails.country}
                onChange={handleChangeAddressFields}
              >
                <MenuItem value="" disabled>
                  <Typography color={(theme) => theme.palette.grey["400"]}>
                    Choose option
                  </Typography>
                </MenuItem>
                {(countries as ICountryStateCity[]).map((country) => (
                  <MenuItem value={country.code} key={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>State</InputLabel>
              <Typography
                variant="h6"
                lineHeight={1}
                color={(theme) => theme.palette.error.main}
              >
                *
              </Typography>
              <Select
                sx={{
                  "& .MuiOutlinedInput-input": { padding: 1, color: "#fff" },
                }}
                style={{
                  padding: "1px",
                  backgroundColor: "#2e2e2e",
                  border: "1px solid #666666",
                  borderRadius: "6px",
                }}
                fullWidth
                variant="outlined"
                name="state"
                displayEmpty
                value={additionalBillingDetails.state}
                onChange={handleChangeAddressFields}
              >
                <MenuItem value="" disabled>
                  <Typography color={(theme) => theme.palette.grey["400"]}>
                    Choose option
                  </Typography>
                </MenuItem>
                {states.length === 0 ? (
                  <MenuItem disabled>No States</MenuItem>
                ) : (
                  states.map((state) => (
                    <MenuItem value={state.name} key={state.code}>
                      {state.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>City</InputLabel>
              <Typography
                variant="h6"
                lineHeight={1}
                color={(theme) => theme.palette.error.main}
              >
                *
              </Typography>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-input": { padding: 1, color: "#fff" },
                }}
                style={{
                  padding: "1px",
                  backgroundColor: "#2e2e2e",
                  border: "1px solid #666666",
                  borderRadius: "6px",
                }}
                fullWidth
                variant="outlined"
                name="city"
                placeholder="Enter City"
                value={additionalBillingDetails.city}
                onChange={handleChangeAddressFields}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>
                ZIP/Postal Code{" "}
                <Typography
                  variant="h6"
                  lineHeight={1}
                  color={(theme) => theme.palette.error.main}
                >
                  *
                </Typography>
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-input": { padding: 1, color: "#fff" },
                }}
                style={{
                  padding: "1px",
                  backgroundColor: "#2e2e2e",
                  border: "1px solid #666666",
                  borderRadius: "6px",
                }}
                fullWidth
                variant="outlined"
                name="zipcode"
                placeholder="Enter ZIP/Postal Code"
                value={additionalBillingDetails.zipcode}
                onChange={handleChangeAddressFields}
              />
            </Grid>
            {showError && (
              <Grid item xs={12}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography
                    variant="body2"
                    color={(theme) => theme.palette.error.main}
                  >
                    Please enter all the required fields
                  </Typography>
                </Stack>
              </Grid>
            )}

            <Grid item xs={12} mt={1}>
              <LoadingButton
                fullWidth
                variant="contained"
                disabled={validateFields()}
                onClick={handlePaymentSubmit}
                loading={paymentLoading}
                type="submit"
              >
                Pay
              </LoadingButton>
            </Grid>
          </Grid>
        )}
      </form>
    </>
  );
}
