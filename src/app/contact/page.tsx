import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact — EKSTUDIO",
  description:
    "Contactez EK STUDIO à Kinshasa — emails, téléphone et adresse du studio.",
};

export default function ContactRoute() {
  return <ContactPage />;
}
