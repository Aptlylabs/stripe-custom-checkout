export const monthlyPricingPlans = [
  {
    subscription: "FREE",
    price: 0,
    caption: "For 3 Months",
    lists: [
      { text: "Allow 50 invites", isAvailable: true },
      { text: "Up to 1 team members", isAvailable: true },
      { text: "Messaging service", isAvailable: false },
    ],
    labelAction: "choose plan",
  },
  {
    subscription: "STARTER",
    price: 10,
    caption: "For one month",
    lists: [
      { text: "Allow 200 invites per month", isAvailable: true },
      { text: "Up to 3 team members", isAvailable: true },
      { text: "Allow 2000 SMS per month", isAvailable: true },
    ],
    labelAction: "choose plan",
  },
  {
    subscription: "PREMIUM",
    price: 20,
    caption: "For one month",
    lists: [
      { text: "Unlimited invites", isAvailable: true },
      { text: "Up to 10 team members", isAvailable: true },
      { text: "Allow 6000 SMS per month", isAvailable: true },
    ],
    labelAction: "choose plan",
  },
];

export const STRIPE_MONTHLY_STARTER_PLAN_ID = "stripe_starter_price_id";
export const STRIPE_MONTHLY_PREMIUM_PLAN_ID = "stripe_premium_price_id";
export const STRIPE_PUBLISHABLE_KEY = "your_stripe_publishable_key";
