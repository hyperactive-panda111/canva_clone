import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from 'next-auth/react';

import {auth} from '@/auth';
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";

import "./globals.css";
import { Modals } from "@/components/modals";
import { SubscriptionAlert } from "@/features/subscriptions/components/subscription-alert";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Graphic Design Pro",
  description: "Making your design goals easy to achieve",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <Toaster />
            <Modals />
            <SubscriptionAlert />
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
