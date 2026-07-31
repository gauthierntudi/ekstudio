import type { Metadata } from "next";
import ProjectsPage from "@/components/ProjectsPage";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projets — EKSTUDIO",
  description:
    "Sélection créative EK STUDIO — campagnes, identités et contenus pour les marques.",
};

export default function ProjetsRoute() {
  const projects = getProjects();
  return <ProjectsPage projects={projects} />;
}
