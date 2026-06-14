import "~/styles/globals.css";

import { type Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/context/ThemeContext";

export const metadata: Metadata = {
  title: "Portfolio - Personal Growth Journey",
  description: "Documenting my personal and professional growth journey",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <TRPCReactProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TRPCReactProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
