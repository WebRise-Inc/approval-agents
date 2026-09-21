import type { Metadata } from "next";
import HomePage from "./home-page";

const title = "Car Search & Auto Financing | Approval Agents";
const description =
  "Find your next car with Approval Agents. Share your vehicle needs and budget to explore car and financing options, or book a free consultation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://approvalagents.ca/" },
  openGraph: {
    title,
    description,
    url: "https://approvalagents.ca/",
    siteName: "Approval Agents",
    type: "website",
  },
};

export default function Page() {
  return <HomePage />;
}
