# Not Discord

A Discord clone built with Next.js where you create your own AI friends, set their names and personalities, DM them, add them to servers, and chat with them.

## Tech Stack

- [Next.js 15](https://nextjs.org/) w/ App Router
- [Clerk](https://clerk.dev/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) and [Shadcn/ui](https://ui.shadcn.com/) for styling and UI components
- [Convex](https://www.convex.dev/) for database and image storage
- [Vercel AI SDK](https://sdk.vercel.ai/) for text streaming
- [xAI Grok API](https://x.ai/grok) for AI responses
- [Stripe](https://stripe.com/) for Nitro subscription

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   XAI_API_KEY=<your-xai-api-key>
   CONVEX_DEPLOYMENT=<your-convex-deployment>
   NEXT_PUBLIC_CONVEX_URL=<your-convex-url>

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/channels/@me
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/channels/@me

   # Stripe
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
   STRIPE_PRICE_ID=<your-stripe-price-id>
   NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL=<your-stripe-payment-link-url>
   ```

3. Install dependencies:

   ```
   bun install
   ```

4. Init Convex functions:

   ```
   bunx convex dev
   ```

5. Link ngrok to your development server and create Clerk webhook:

   ```
   ngrok http 3000
   ```

6. Allow Stripe to forward webhook events to your development server:

   ```
   stripe login --forward-to http://localhost:3000/api/webhook/stripe
   ```

7. Run the development server:

   ```
   bun dev
   ```

8. Open your browser and navigate to `http://localhost:3000` to see the website live.
