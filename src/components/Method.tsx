"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import CtaButton from "@/components/CtaButton";

const IMAGES = [
  "/images/01.jpg",
  "/images/02.jpg",
  "/images/03.jpg",
  "/images/04.jpg",
  "/images/05.jpg",
  "/images/06.jpg",
  "/images/07.jpg",
  "/images/08.jpg",
  "/images/09.jpg",
  "/images/010.jpg",
  "/images/011.jpg",
  "/images/012.jpg",
  "/images/013.jpg",
  "/images/014.jpg",
  "/images/015.jpg",
  "/images/016.jpg",
  "/images/017.jpg",
];

/** Varied heights for a masonry rhythm */
const HEIGHTS = ["h-40", "h-56", "h-72", "h-48", "h-64", "h-80", "h-52", "h-60"];

function chunkColumns(count: number) {
  const cols: string[][] = Array.from({ length: count }, () => []);
  IMAGES.forEach((src, i) => {
    cols[i % count].push(src);
  });
  return cols;
}

function MarqueeColumn({
  images,
  reverse = false,
  duration = 28,
}: {
  images: string[];
  reverse?: boolean;
  duration?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...images, ...images];

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(track, { y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(track, { yPercent: reverse ? -50 : 0 });
        gsap.to(track, {
          yPercent: reverse ? 0 : -50,
          duration,
          ease: "none",
          repeat: -1,
        });
      });

      return () => mm.revert();
    },
    { scope: trackRef, dependencies: [reverse, duration] },
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={trackRef} className="flex w-full flex-col gap-3 will-change-transform md:gap-4">
        {items.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`relative w-full shrink-0 overflow-hidden rounded-2xl ${HEIGHTS[i % HEIGHTS.length]}`}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 40vw, 22vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const columns = chunkColumns(4);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".method-label", ".method-title", ".method-copy", ".method-cta"], {
          autoAlpha: 1,
          y: 0,
        });
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
          ".method-label",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
        )
          .fromTo(
            ".method-title",
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
            "-=0.25",
          )
          .fromTo(
            ".method-copy",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 },
            "-=0.4",
          )
          .fromTo(
            ".method-cta",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            "-=0.35",
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="methode"
      className="snap-section relative overflow-hidden bg-black"
    >
      {/* Masonry marquee background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 grid grid-cols-2 gap-3 px-2 pt-2 opacity-55 md:grid-cols-4 md:gap-4 md:px-3 md:pt-3 md:opacity-45"
        aria-hidden
      >
        <MarqueeColumn images={columns[0]} duration={32} />
        <MarqueeColumn images={columns[1]} reverse duration={26} />
        <div className="hidden h-full md:block">
          <MarqueeColumn images={columns[2]} duration={36} />
        </div>
        <div className="hidden h-full md:block">
          <MarqueeColumn images={columns[3]} reverse duration={24} />
        </div>
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/55 to-black/80" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-end px-6 pb-10 pt-28 md:px-10 md:pb-14 md:pt-32">
        <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex max-w-xl flex-col items-start">
            <p className="method-label mb-5 text-[0.7rem] font-medium tracking-[0.22em] uppercase text-white/55">
              Méthode
            </p>

            <h2 className="method-title font-display text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
              Une vision qui donne vie{" "}
              <span className="text-[color:var(--accent)]">aux marques</span>
            </h2>

            <div className="mt-8 max-w-lg space-y-5">
              <p className="method-copy text-base leading-snug text-white/80 md:text-lg md:leading-snug">
                Chez EK STUDIO, nous créons des identités fortes, des récits
                visuels impactants et des expériences qui connectent durablement
                les marques à leur public.
              </p>
              <p className="method-copy text-base leading-snug text-white/60 md:text-lg md:leading-snug">
                Chaque création est intentionnelle, stratégique et porteuse de
                sens. Nous transformons les idées en univers visuels singuliers,
                capables de faire émerger les marques d’aujourd’hui et de demain.
              </p>
            </div>
          </div>

          <div className="method-cta grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:min-w-[14rem] sm:flex-col sm:gap-4">
            <CtaButton href="/projets" variant="accent" size="sm" block>
              Nos projets
            </CtaButton>

            <CtaButton href="/contact" variant="outline" size="sm" block>
              Nous écrire
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
