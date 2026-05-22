import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agent Approvals | Sub-prime Auto Financing",
  description:
    "Apply with Agent Approvals for auto financing options built for challenged credit, new credit, and past credit issues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bricolage.variable}>{children}</body>
    </html>
  );
}
