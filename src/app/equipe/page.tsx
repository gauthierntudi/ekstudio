import type { Metadata } from "next";
import Team from "@/components/Team";

export const metadata: Metadata = {
  title: "Équipe — EKSTUDIO",
  description:
    "Best crew — les talents EK STUDIO à Kinshasa. Stratégie, création et production.",
};

export default function EquipePage() {
  return <Team />;
}
