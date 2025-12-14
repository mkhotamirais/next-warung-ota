import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { NextAuthProviders } from "@/components/providers/NextAuthProvider";
import ClientProvider from "@/components/providers/ClientProvider";
import { content as c } from "@/lib/content";

const { title, description } = c.home.hero;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { title: { default: title, template: "%s - WarungOta" }, description };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo-warungota-favicon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
        <NextAuthProviders>
          <ClientProvider>
            <Toaster richColors position="top-center" swipeDirections={["bottom", "left", "right", "top"]} />
            <Header />
            {children}
            <Footer />
          </ClientProvider>
        </NextAuthProviders>
      </body>
    </html>
  );
}
