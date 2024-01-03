
# Stripe Subscription Custom Checkout Flow
This code will explain how to use Stripe to create a custom subscription checkout flow. Such that you can design checkout page of your design ideas by collecting card informations securely. It will cover both client-side (React js) and server-side (Node js) components.



## Author

- [@nikinshan](https://github.com/nikinshan)


## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

A custom checkout flow tailored to our platform's needs. Instead of redirecting users to a separate Stripe checkout page, we can implement a seamless and branded experience within our application. This ensures a consistent look and feel for users throughout the entire purchasing process.

Key aspects of the Stripe custom checkout flow include:

- **Pricing and Planning:** The pricing and planning page allows user to choose the plan which is suitable for their purpose
- **Customized Checkout Form:** The checkout form can be designed as per your brand to collect necessary information efficiently and securely, enhancing user experience.
- **Webhooks Integration:** The backend utilizes Stripe webhooks to handle events such as successful payments, order fulfillment, and more.
## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-project.git

# Navigate to the project directory
cd stripe-project

# Install dependencies for frontend
cd client
npm install

# Install dependencies for backend
cd ../server
npm install
```

    
## Configuration
### Frontend Configuration
#### Navigate to the frontend directory
cd client

#### Create a .env file and add your Stripe public key
STRIPE_PUBLISHABLE_KEY=your-stripe-public-key,

#### Add your priceId created from stripe
STRIPE_MONTHLY_STARTER_PLAN_ID=your-starter-priceId
STRIPE_MONTHLY_PREMIUM_PLAN_ID=your-premium-priceId

### Backend Configuration

#### Navigate to the backend directory
cd server

#### Create a .env file and add your Stripe and Webhook secret key
STRIPE_SECRET_KEY=your-stripe-secret-key
WEB_HOOK_SECRET_KEY=your-stripe-secret-key
## Folder Structure
```
stripe-project/
|-- client/
|   |-- src/
|   |   |-- assets/
|   |   |   |-- country_state_city_list.json
|   |   |-- utils/
|   |   |   |-- axios.ts
|   |   |   |-- constants.ts
|   |   |-- app.tsx
|   |   |-- checkout.tsx
|   |   |-- index.css
|   |   |-- index.tsx
|   |   |-- paymentForm.tsx
|   |   |-- paymentSuccessPage.tsx
|   |   |-- pricingPlanCard.tsx
|-- server/
|   |-- src/
|   |   |-- controller/
|   |   |   |-- create-subscription.ts
|   |   |   |-- stripe-webhook.ts
|   |   |-- route/
|   |   |   |-- index.ts
|   |   |   |-- subscription.ts
|   |   |   |-- webhook.ts
|   |   |-- constants.ts
|   |   |-- server.ts



```
## Dependencies


- **React:** 18.2.0
- **Node.js:** 19.3.0
- **Stripe API:** 14.10.0
## License

[MIT](https://choosealicense.com/licenses/mit/)

