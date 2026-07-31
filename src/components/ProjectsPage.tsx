"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

const ProjectsWall3D = dynamic(
  () => import("@/components/projects/ProjectsWall3D"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-10 bg-black" />,
  },
);

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [curve, setCurve] = useState(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const tags = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.tags))).sort(
        (a, b) => a.localeCompare(b, "fr"),
      ),
    [projects],
  );

  const visible = useMemo(
    () =>
      activeTag
        ? projects.filter((project) => project.tags.includes(activeTag))
        : projects,
    [projects, activeTag],
  );

  const curveProxy = useRef({ v: 1 });

  const setCurveAnimated = (value: number) => {
    gsap.to(curveProxy.current, {
      v: value,
      duration: 0.85,
      ease: "power3.inOut",
      onUpdate: () => setCurve(curveProxy.current.v),
    });
  };

  return (
    <main className="relative h-svh overflow-hidden bg-black text-white">
      {visible.length > 0 ? (
        <ProjectsWall3D
          projects={visible}
          curve={curve}
          onNavigate={(href) => router.push(href)}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-white/50">
          Aucun projet pour ce filtre.
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between gap-3 p-4 md:p-6">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurveAnimated(1)}
            aria-pressed={curve > 0.5}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-colors ${
              curve > 0.5
                ? "border-white bg-white text-black"
                : "border-white/20 bg-black/50 text-white/70 backdrop-blur-md hover:border-white/40"
            }`}
            title="Vue courbe 3D"
          >
            <span aria-hidden className="grid grid-cols-2 gap-0.5">
              <i className="block h-1.5 w-1.5 rounded-[1px] bg-current" />
              <i className="block h-1.5 w-1.5 rounded-[1px] bg-current opacity-70" />
              <i className="block h-1.5 w-1.5 rounded-[1px] bg-current opacity-70" />
              <i className="block h-1.5 w-1.5 rounded-[1px] bg-current" />
            </span>
            <span className="sr-only">Vue courbe 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setCurveAnimated(0)}
            aria-pressed={curve <= 0.5}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-colors ${
              curve <= 0.5
                ? "border-white bg-white text-black"
                : "border-white/20 bg-black/50 text-white/70 backdrop-blur-md hover:border-white/40"
            }`}
            title="Vue plate"
          >
            <span aria-hidden className="flex flex-col gap-0.5">
              <i className="block h-0.5 w-3.5 bg-current" />
              <i className="block h-0.5 w-3.5 bg-current" />
              <i className="block h-0.5 w-3.5 bg-current" />
            </span>
            <span className="sr-only">Vue plate</span>
          </button>
        </div>

        <div className="pointer-events-auto hidden items-center rounded-full border border-white/15 bg-black/55 p-1 backdrop-blur-md sm:flex">
          <Link
            href="/projets"
            className="rounded-full bg-white px-4 py-2 text-[0.65rem] font-medium tracking-[0.16em] uppercase text-black"
          >
            Work
          </Link>
          <Link
            href="/equipe"
            className="rounded-full px-4 py-2 text-[0.65rem] tracking-[0.16em] uppercase text-white/55 transition-colors hover:text-white"
          >
            Équipe
          </Link>
          <Link
            href="/contact"
            className="rounded-full px-4 py-2 text-[0.65rem] tracking-[0.16em] uppercase text-white/55 transition-colors hover:text-white"
          >
            Contact
          </Link>
        </div>

        <div className="pointer-events-auto relative">
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className="rounded-full border border-white/15 bg-black/55 px-4 py-2.5 text-[0.65rem] tracking-[0.16em] uppercase text-white/80 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
          >
            Filter{activeTag ? ` · ${activeTag}` : ""}
          </button>
          {filterOpen ? (
            <div className="absolute right-0 bottom-[calc(100%+0.5rem)] min-w-[11rem] rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setActiveTag(null);
                  setFilterOpen(false);
                }}
                className={`block w-full rounded-xl px-3 py-2 text-left text-[0.7rem] tracking-[0.12em] uppercase transition-colors ${
                  !activeTag
                    ? "bg-white text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setActiveTag(tag);
                    setFilterOpen(false);
                  }}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-[0.7rem] tracking-[0.12em] uppercase transition-colors ${
                    activeTag === tag
                      ? "bg-white text-black"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
