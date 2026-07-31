"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Studio() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [".studio-cred", ".studio-title", ".studio-copy", ".studio-visual"],
          { autoAlpha: 1, y: 0, x: 0 },
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        });

        tl.fromTo(
          ".studio-visual",
          { autoAlpha: 0, x: 24 },
          { autoAlpha: 1, x: 0, duration: 1.1, ease: "power2.out" },
        )
          .fromTo(
            ".studio-cred",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            "-=0.7",
          )
          .fromTo(
            ".studio-title",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.75 },
            "-=0.35",
          )
          .fromTo(
            ".studio-copy",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
            "-=0.4",
          );

        gsap.set(".studio-visual-motion", {
          scale: 1,
          transformOrigin: "70% 45%",
        });
        gsap.to(".studio-visual-motion", {
          scale: 1.012,
          duration: 4.5,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="snap-section relative overflow-hidden bg-[#f4f4f2] text-black"
    >
      <div className="absolute inset-0">
        <Image
          src="/img/bg-white.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Desktop visual — right column full height */}
      <div className="studio-visual pointer-events-none absolute inset-y-0 right-0 z-[1] hidden overflow-hidden md:flex md:w-[58%] md:items-center md:justify-end lg:w-[55%]">
        <div className="studio-visual-motion relative h-full w-full will-change-transform">
          <Image
            src="/img/histo-01.png"
            alt="EK STUDIO — laboratoire créatif"
            fill
            priority
            className="object-contain object-right"
            sizes="58vw"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col md:block">
        {/* Mobile visual — top band */}
        <div className="studio-visual relative z-[1] flex min-h-0 flex-[0.95] items-start justify-end overflow-hidden pr-0 pl-4 pt-0 md:hidden">
          <div className="studio-visual-motion relative h-full w-full max-w-sm will-change-transform">
            <Image
              src="/img/histo-01.png"
              alt="EK STUDIO — laboratoire créatif"
              fill
              priority
              className="object-contain object-right-top"
              sizes="90vw"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white from-15% via-white/85 via-45% to-transparent to-100%"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-white/0"
            aria-hidden
          />
        </div>

        {/* Credentials — desktop only */}
        <div className="studio-cred absolute bottom-10 left-6 z-20 hidden flex-col items-center gap-3 md:left-10 md:flex">
          <span className="origin-center -rotate-180 text-[0.65rem] font-medium tracking-[0.28em] uppercase text-black/45 [writing-mode:vertical-rl]">
            Credentials 2025
          </span>
          <span aria-hidden className="text-black/40">
            ↓
          </span>
        </div>

        {/* Copy */}
        <div className="relative z-10 flex flex-[1.05] flex-col justify-end px-6 pb-8 pt-2 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[48%] md:justify-center md:px-10 md:pb-0 md:pt-0 lg:w-[45%] lg:pl-20">
          <div className="flex w-full max-w-md flex-col items-start md:max-w-none">
            <p className="studio-cred mb-3 text-[0.65rem] font-medium tracking-[0.22em] uppercase text-black/40 md:hidden">
              Credentials 2025
            </p>

            <h2 className="studio-title max-w-[16ch] font-display text-[clamp(1.45rem,6.2vw,2.85rem)] font-semibold leading-[1.08] tracking-[-0.03em] uppercase text-black md:max-w-[14ch]">
              Un laboratoire créatif au cœur de{" "}
              <span className="text-[color:var(--accent)]">Kinshasa</span>
            </h2>

            <div className="mt-4 space-y-3 md:mt-8 md:space-y-4">
              <p className="studio-copy text-[0.9rem] leading-snug text-black/75 md:text-base md:leading-snug">
                Fondé en 2019 à Kinshasa, EK STUDIO est un studio de
                communication visuelle où stratégie, créativité et technologie
                se rencontrent. Nous concevons des expériences visuelles
                impactantes qui engagent, convainquent et valorisent
                durablement les marques.
              </p>
              <p className="studio-copy text-[0.9rem] leading-snug text-black/55 md:text-base md:leading-snug">
                Notre mission : transformer chaque projet en une identité
                forte, visible et mémorable grâce à une approche alliant
                innovation et vision stratégique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
