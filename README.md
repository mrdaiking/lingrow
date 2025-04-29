# Business English Skills SaaS

A Next.js application offering tools for improving business English communication skills with user authentication.

## Features

- User registration and login with Firebase Authentication
  - Email/password authentication
  - Social authentication (Google, Facebook, Twitter)
- Responsive landing page with modern design using TailwindCSS
- Email collection for beta program
- "How It Works" section explaining the product
- Authentication state management across the application

## Getting Started

First, set up your Firebase project:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication in the Firebase console:
   - Go to the Authentication section
   - Enable Email/Password authentication
   - For social authentication:
     - **Google**: Enable Google provider and configure OAuth consent screen in Google Cloud Console
     - **Facebook**: Enable Facebook provider and enter your Facebook App ID and App Secret from [Facebook Developers](https://developers.facebook.com/)
     - **Twitter**: Enable Twitter provider and enter your API Key and API Secret from [Twitter Developer Portal](https://developer.twitter.com/)
3. Copy your Firebase config from Project Settings > General > Your Apps to your `.env.local` file:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/page.js` - Main landing page
- `src/app/register/page.js` - User registration page with social options
- `src/app/login/page.js` - User login page with social options
- `src/config/firebase.js` - Firebase configuration
- `src/context/AuthContext.js` - Authentication context for user state management
- `src/context/AuthProviderWrapper.js` - Client component wrapper for AuthProvider

## Technologies Used

- Next.js - React framework
- Firebase - Authentication (email/password and social providers)
- TailwindCSS - Styling
- React Context API - State management

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Firebase Authentication](https://firebase.google.com/docs/auth) - learn about Firebase Authentication methods.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

