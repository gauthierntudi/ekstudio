"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import Footer from "@/components/Footer";
import type { Project } from "@/lib/projects";
import {
  consumeProjectTransition,
  type ProjectTransitionPayload,
} from "@/lib/project-transition";

export default function ProjectDetail({
  project,
  next,
  prev,
}: {
  project: Project;
  next?: Project;
  prev?: Project;
}) {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLButtonElement>(null);
  const handoffRef = useRef<ProjectTransitionPayload | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const shots = project.images;
  const gallery = shots.slice(1);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const showPrev = useCallback(() => {
    setLightbox((i) => {
      if (i === null || shots.length === 0) return i;
      return (i - 1 + shots.length) % shots.length;
    });
  }, [shots.length]);

  const showNext = useCallback(() => {
    setLightbox((i) => {
      if (i === null || shots.length === 0) return i;
      return (i + 1) % shots.length;
    });
  }, [shots.length]);

  useEffect(() => {
    if (lightbox === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, showPrev, showNext]);

  useLayoutEffect(() => {
    const payload = consumeProjectTransition(project.slug);
    handoffRef.current = payload;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hero = heroRef.current;
    if (!payload || !hero || reduce) return;

    const clone = document.createElement("div");
    clone.style.cssText = [
      "position:fixed",
      `top:${payload.rect.top}px`,
      `left:${payload.rect.left}px`,
      `width:${payload.rect.width}px`,
      `height:${payload.rect.height}px`,
      "z-index:80",
      "overflow:hidden",
      "pointer-events:none",
      "will-change:top,left,width,height",
    ].join(";");

    const img = document.createElement("img");
    img.src = payload.src;
    img.alt = "";
    img.style.cssText =
      "width:100%;height:100%;object-fit:cover;display:block;";
    clone.appendChild(img);
    document.body.appendChild(clone);

    gsap.set(hero, { autoAlpha: 0 });
    gsap.set(".project-sticky", { autoAlpha: 0, y: -10 });

    const target = hero.getBoundingClientRect();

    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(hero, { autoAlpha: 1 });
          clone.remove();
          gsap.to(".project-sticky", {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
          });
          ScrollTrigger.refresh();
        },
      })
      .to(clone, {
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
        duration: 0.75,
      });
  }, [project.slug]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const hadHandoff = Boolean(handoffRef.current);

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".project-sticky",
            ".project-hero",
            ".project-shot",
            ".project-nav",
            ".project-meta",
          ],
          { autoAlpha: 1, y: 0, scale: 1 },
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!hadHandoff) {
          gsap.fromTo(
            ".project-sticky",
            { autoAlpha: 0, y: -12 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
          );
          gsap.fromTo(
            ".project-hero",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" },
          );
        }

        gsap.fromTo(
          ".project-meta",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            delay: hadHandoff ? 0.3 : 0.1,
            ease: "power3.out",
          },
        );

        gsap.utils.toArray<HTMLElement>(".project-shot").forEach((shot) => {
          gsap.fromTo(
            shot,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              scrollTrigger: {
                trigger: shot,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        gsap.fromTo(
          ".project-nav",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: ".project-nav",
              start: "top 94%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: pageRef, dependencies: [project.slug] },
  );

  return (
    <main ref={pageRef} className="relative bg-black text-white">
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <Image
            src="/img/bg-black.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-24">
          <div className="project-sticky">
            <Link
              href="/projets"
              className="inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.2em] uppercase text-white/45 transition-colors hover:text-white"
            >
              ← Projets
            </Link>

            <div className="mt-5 flex flex-col gap-5 md:mt-8 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <h1 className="font-display text-[clamp(2rem,7vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] uppercase text-white">
                  {project.title}
                </h1>
                <div className="project-meta mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-mono text-[0.65rem] tracking-[0.14em] text-white/40">
                    {project.year}
                  </span>
                  <span className="text-white/20" aria-hidden>
                    ·
                  </span>
                  <p className="text-sm text-white/55">{project.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 px-3 py-1 text-[0.55rem] tracking-[0.14em] uppercase text-white/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            ref={heroRef}
            onClick={() => openLightbox(0)}
            className="project-hero group relative mt-8 block w-full cursor-zoom-in overflow-hidden bg-white/[0.03] text-left md:mt-12"
          >
            <Image
              src={project.cover}
              alt={project.title}
              width={2000}
              height={1400}
              priority
              className="h-auto w-full object-contain transition-opacity duration-300 group-hover:opacity-90"
              sizes="100vw"
            />
            <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1 text-[0.6rem] tracking-[0.14em] uppercase text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 md:right-4 md:bottom-4">
              Agrandir
            </span>
          </button>

          {gallery.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-5 md:gap-5">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => openLightbox(index + 1)}
                  className={`project-shot group relative cursor-zoom-in overflow-hidden bg-white/[0.03] text-left ${
                    gallery.length % 2 === 1 && index === gallery.length - 1
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${project.title} — ${String(index + 2).padStart(2, "0")}`}
                    width={1600}
                    height={2000}
                    className="h-auto w-full object-contain transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="project-nav mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            {prev ? (
              <Link
                href={`/projets/${prev.slug}`}
                className="text-sm text-white/50 transition-colors hover:text-[color:var(--accent)]"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projets/${next.slug}`}
                className="text-sm text-white/50 transition-colors hover:text-[color:var(--accent)] sm:text-right"
              >
                {next.title} →
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />

      {lightbox !== null ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`Visuel ${lightbox + 1} sur ${shots.length}`}
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 md:px-6">
            <p className="font-mono text-[0.7rem] tracking-[0.14em] text-white/45">
              {String(lightbox + 1).padStart(2, "0")} /{" "}
              {String(shots.length).padStart(2, "0")}
            </p>
            <p className="truncate text-[0.7rem] tracking-[0.16em] uppercase text-white/50">
              {project.title}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-14"
            onClick={closeLightbox}
          >
            {shots.length > 1 ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute top-1/2 left-2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-white/10 md:left-4"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.75} />
              </button>
            ) : null}

            <div
              className="relative h-[calc(100svh-7.5rem)] w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                key={shots[lightbox]}
                src={shots[lightbox]!}
                alt={`${project.title} — ${String(lightbox + 1).padStart(2, "0")}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                quality={95}
              />
            </div>

            {shots.length > 1 ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute top-1/2 right-2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-white/10 md:right-4"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.75} />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
