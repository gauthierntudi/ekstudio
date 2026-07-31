import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { getProject, getProjects } from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projet — EKSTUDIO" };
  return {
    title: `${project.title} — EKSTUDIO`,
    description: `Projet ${project.title} — EK STUDIO Kinshasa.`,
  };
}

export default async function ProjetDetailRoute({ params }: Props) {
  const { slug } = await params;
  const projects = getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];

  if (!project) notFound();

  const prev = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;

  return <ProjectDetail project={project} prev={prev} next={next} />;
}
