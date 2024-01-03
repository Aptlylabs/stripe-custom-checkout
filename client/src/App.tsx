import PricingPlanCard from "./PricingPlanCard";
import { monthlyPricingPlans } from "./utils/constants";
import { Box } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PaymentSuccessPage from "./PaymentSuccessPage";
import Checkout from "./Checkout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Box
          gap={3}
          padding={30}
          display="grid"
          gridTemplateColumns={{ md: "repeat(3, 1fr)" }}
        >
          {monthlyPricingPlans.map((card, index) => (
            <PricingPlanCard
              key={card.subscription}
              card={card}
              index={index}
            />
          ))}
        </Box>
      ),
    },
    {
      path: "/checkout",
      element: <Checkout />,
    },
    {
      path: "/success",
      element: <PaymentSuccessPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
