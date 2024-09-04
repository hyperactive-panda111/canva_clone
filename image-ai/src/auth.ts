import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github"; // Use GitHubProvider instead of just GitHub
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { db } from '@/db/drizzle';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),

  providers: [
    GitHub
  ],

  // Additional configuration options
});
