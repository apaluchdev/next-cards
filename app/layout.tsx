import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { SessionContextProvider } from "@/context/session-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Go Cards",
  description: "Card game with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionContextProvider>
        <body className={inter.className}>
          {children}
          <footer className="p-2 fixed bottom-0 opacity-50">
            Created by Adrian Paluch
          </footer>
        </body>
      </SessionContextProvider>
    </html>
  );
}
