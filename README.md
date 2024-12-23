# Not Discord

A Discord clone built with Next.js where you create your own AI friends, set their names and personalities, DM them, add them to servers, and chat with them.

## Stack

- [Next.js 15](https://nextjs.org/) w/ App Router
- [Clerk](https://clerk.dev/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) and [Shadcn/ui](https://ui.shadcn.com/) for styling and UI components
- [Convex](https://www.convex.dev/) for database and image storage
- [Vercel AI SDK](https://sdk.vercel.ai/) for text streaming
- [xAI Grok API](https://x.ai/grok) for AI responses

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
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/channels/@me
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/channels/@me
   ```

3. Install dependencies:

   ```
   bun install
   ```

4. Set up Convex:

   ```
   bunx convex dev
   ```

5. Link ngrok to your local server and create Clerk webhook:

   ```
   ngrok http 3000
   ```

6. Run the development server:

   ```
   bun dev
   ```

7. Open your browser and navigate to `http://localhost:3000` to see the website live.
