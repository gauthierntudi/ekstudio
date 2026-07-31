import type { Metadata } from "next";
import MethodPage from "@/components/MethodPage";

export const metadata: Metadata = {
  title: "Méthode — EKSTUDIO",
  description:
    "Méthodologie de travail EK STUDIO — immersion, conception, production et déploiement.",
};

export default function MethodeRoute() {
  return <MethodPage />;
}
