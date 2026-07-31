"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const heroRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<ProjectTransitionPayload | null>(null);
  const router = useRouter();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [activeShot, setActiveShot] = useState(1);

  const galleryImages =
    project.images.length > 1 ? project.images.slice(1) : [];
  const totalShots = project.images.length;

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
            ".project-dock",
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
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            },
          );
          gsap.fromTo(
            ".project-hero",
            { autoAlpha: 0, scale: 1.04 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.9,
              ease: "power2.out",
            },
          );
        }

        gsap.fromTo(
          ".project-meta",
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            delay: hadHandoff ? 0.35 : 0.15,
            ease: "power3.out",
          },
        );

        gsap.fromTo(
          ".project-dock",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            delay: 0.25,
            ease: "power3.out",
          },
        );

        gsap.utils.toArray<HTMLElement>(".project-shot").forEach((shot, i) => {
          gsap.fromTo(
            shot,
            { autoAlpha: 0, y: 36 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: shot,
                start: "top 88%",
                end: "bottom 12%",
                toggleActions: "play reverse play reverse",
                onEnter: () => setActiveShot(i + 2),
                onEnterBack: () => setActiveShot(i + 2),
              },
            },
          );
        });

        const heroEl = heroRef.current;
        if (heroEl) {
          ScrollTrigger.create({
            trigger: heroEl,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveShot(1),
            onEnterBack: () => setActiveShot(1),
          });
        }

        gsap.fromTo(
          ".project-nav",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            scrollTrigger: {
              trigger: ".project-nav",
              start: "top 92%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: pageRef, dependencies: [project.slug] },
  );

  const onTouchStart = (event: ReactTouchEvent) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: ReactTouchEvent) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Edge-ish horizontal swipe only — avoid fighting vertical scroll
    if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.35) return;

    if (dx < 0 && next) {
      router.push(`/projets/${next.slug}`);
      return;
    }
    if (dx > 0 && prev) {
      router.push(`/projets/${prev.slug}`);
    }
  };

  const counter = `${String(activeShot).padStart(2, "0")} / ${String(totalShots).padStart(2, "0")}`;

  return (
    <main
      ref={pageRef}
      className="relative bg-black text-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <section className="relative isolate overflow-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
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

        {/* Mobile sticky chrome */}
        <div className="project-sticky sticky top-16 z-30 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md md:static md:top-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 md:px-10 md:pt-32">
            <div className="flex items-center justify-between gap-3 md:block">
              <Link
                href="/projets"
                className="inline-flex min-h-10 items-center gap-2 text-[0.65rem] font-medium tracking-[0.2em] uppercase text-white/55 transition-colors hover:text-white"
              >
                ← Work
              </Link>
              <p className="font-mono text-[0.65rem] tracking-[0.12em] text-white/35 md:hidden">
                {counter}
              </p>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate font-display text-[clamp(1.45rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] uppercase text-white md:whitespace-normal md:overflow-visible">
                  {project.title}
                </h1>
                <p className="mt-1 hidden text-sm tracking-[0.14em] text-white/45 md:mt-3 md:block">
                  {totalShots} visuel{totalShots > 1 ? "s" : ""}
                </p>
              </div>
              <div className="hidden shrink-0 gap-3 text-[0.65rem] tracking-[0.16em] uppercase text-white/35 md:flex">
                {prev ? (
                  <Link
                    href={`/projets/${prev.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    Prev
                  </Link>
                ) : null}
                {next ? (
                  <Link
                    href={`/projets/${next.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl md:px-10 md:pb-20">
          {/* Meta — compact on mobile */}
          <div className="project-meta flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pt-4 md:mt-6 md:px-0">
            <span className="font-mono text-[0.65rem] tracking-[0.14em] text-white/40">
              {project.year}
            </span>
            <span className="text-white/20" aria-hidden>
              ·
            </span>
            <p className="text-[0.8rem] text-white/55 md:text-sm">
              {project.subtitle}
            </p>
            <div className="flex w-full flex-wrap gap-1.5 md:ml-auto md:w-auto">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[0.55rem] tracking-[0.14em] uppercase text-white/65"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero — taller / full-bleed on mobile */}
          <div
            ref={heroRef}
            className="project-hero relative mt-4 aspect-[4/5] w-full overflow-hidden bg-white/5 md:mt-10 md:aspect-[21/9]"
          >
            <Image
              src={project.cover}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {galleryImages.length > 0 ? (
            <div className="mt-1.5 flex flex-col gap-1.5 md:mt-10 md:columns-2 md:gap-0 md:block md:[column-gap:1.25rem] lg:[column-gap:1.5rem]">
              {galleryImages.map((src, index) => (
                <figure
                  key={src}
                  className="project-shot break-inside-avoid md:mb-5 lg:mb-6"
                >
                  <div className="relative w-full overflow-hidden bg-white/5">
                    <Image
                      src={src}
                      alt={`${project.title} — ${String(index + 2).padStart(2, "0")}`}
                      width={1600}
                      height={2000}
                      className="h-auto w-full object-cover"
                      sizes="100vw"
                    />
                  </div>
                </figure>
              ))}
            </div>
          ) : null}

          {/* Desktop footer nav */}
          <div className="project-nav mt-14 hidden border-t border-white/10 px-0 pt-8 md:flex md:flex-row md:items-center md:justify-between">
            {prev ? (
              <Link
                href={`/projets/${prev.slug}`}
                className="text-sm text-white/55 transition-colors hover:text-[color:var(--accent)]"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projets/${next.slug}`}
                className="text-sm text-white/55 transition-colors hover:text-[color:var(--accent)] sm:text-right"
              >
                {next.title} →
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* Mobile bottom dock */}
      <div className="project-dock fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/85 px-3 pt-2 backdrop-blur-md md:hidden pb-[max(0.65rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          {prev ? (
            <Link
              href={`/projets/${prev.slug}`}
              className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2 active:bg-white/10"
            >
              <span className="shrink-0 text-white/40" aria-hidden>
                ←
              </span>
              <span className="truncate text-[0.7rem] tracking-[0.04em] uppercase text-white/75">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}

          <p className="shrink-0 px-1 font-mono text-[0.6rem] tracking-[0.14em] text-white/35">
            {counter}
          </p>

          {next ? (
            <Link
              href={`/projets/${next.slug}`}
              className="flex min-h-12 min-w-0 flex-1 items-center justify-end gap-2 rounded-xl bg-white/5 px-3 py-2 text-right active:bg-white/10"
            >
              <span className="truncate text-[0.7rem] tracking-[0.04em] uppercase text-white/75">
                {next.title}
              </span>
              <span className="shrink-0 text-white/40" aria-hidden>
                →
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </main>
  );
}
