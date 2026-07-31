"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const BEATS = ["Elle parle.", "Elle touche.", "Elle agit."];

const SLIDES = [
  {
    bg: "/img/bg-green.png",
    figure: "/img/bonhom-01.png",
    alt: "EKSTUDIO — portrait 01",
  },
  {
    bg: "/img/bg-orange.png",
    figure: "/img/bonhom-02.png",
    alt: "EKSTUDIO — portrait 02",
  },
] as const;

const HOLD_DURATION = 5.5;
const CROSSFADE_DURATION = 1.15;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".hero-title-line",
            ".hero-lead",
            ".hero-beat",
            ".hero-cta",
            ".hero-bg-slide",
            ".hero-figure",
            ".hero-scroll",
          ],
          { autoAlpha: 1, y: 0, scale: 1 },
        );
        gsap.set(".hero-bg-slide--b, .hero-fig-slide--b", { autoAlpha: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".hero-bg-slide--b, .hero-fig-slide--b", { autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          ".hero-bg-slide--a",
          { scale: 1.06, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.4, ease: "power2.out" },
        )
          .fromTo(
            ".hero-figure",
            { autoAlpha: 0, y: 48, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out" },
            "-=0.9",
          )
          .fromTo(
            ".hero-title-line",
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12 },
            "-=0.55",
          )
          .fromTo(
            ".hero-lead",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.65 },
            "-=0.35",
          )
          .fromTo(
            ".hero-beat",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.18 },
            "-=0.25",
          )
          .fromTo(
            ".hero-cta",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            "-=0.15",
          )
          .fromTo(
            ".hero-scroll",
            { autoAlpha: 0, y: -8 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.2",
          );

        gsap.to(".hero-figure-float", {
          y: -12,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2,
        });

        gsap.to(".hero-scroll-chevron", {
          y: 6,
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.6,
        });

        const cycle = gsap.timeline({
          repeat: -1,
          delay: HOLD_DURATION + 1.8,
          defaults: { duration: CROSSFADE_DURATION, ease: "power2.inOut" },
        });

        cycle
          .to(".hero-bg-slide--a", { autoAlpha: 0 })
          .to(".hero-bg-slide--b", { autoAlpha: 1 }, "<")
          .to(
            ".hero-fig-slide--a",
            { autoAlpha: 0, scale: 0.96, y: 16 },
            "<",
          )
          .to(
            ".hero-fig-slide--b",
            { autoAlpha: 1, scale: 1, y: 0 },
            "<0.1",
          )
          .to({}, { duration: HOLD_DURATION })
          .to(".hero-bg-slide--b", { autoAlpha: 0 })
          .to(".hero-bg-slide--a", { autoAlpha: 1 }, "<")
          .to(
            ".hero-fig-slide--b",
            { autoAlpha: 0, scale: 0.96, y: 16 },
            "<",
          )
          .to(
            ".hero-fig-slide--a",
            { autoAlpha: 1, scale: 1, y: 0 },
            "<0.1",
          )
          .to({}, { duration: HOLD_DURATION });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="snap-section relative overflow-hidden"
    >
      <div className="hero-bg absolute inset-0">
        <div className="hero-bg-slide hero-bg-slide--a absolute inset-0">
          <Image
            src={SLIDES[0].bg}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="hero-bg-slide hero-bg-slide--b absolute inset-0">
          <Image
            src={SLIDES[1].bg}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-end px-6 pt-24 md:grid-cols-12 md:items-center md:gap-x-8 md:px-10 md:pt-0 lg:gap-x-12">
        <div className="relative z-10 flex w-full flex-col items-start gap-7 pb-20 md:col-span-5 md:gap-9 md:pb-0 lg:col-span-5">
          <h1 className="w-full max-w-[16ch] font-display text-[clamp(1.85rem,4.2vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            <span className="hero-title-line block">Là où l’image</span>
            <span className="hero-title-line block">devient une</span>
            <span className="hero-title-line block text-black">expérience</span>
          </h1>

          <div className="w-full max-w-sm space-y-4">
            <p className="hero-lead text-base leading-relaxed text-white/90 md:text-lg">
              Ici, l’image ne se contente pas d’être belle.
            </p>
            <p className="flex flex-wrap gap-x-3 gap-y-1 font-display text-lg font-medium tracking-tight text-white md:text-xl">
              {BEATS.map((beat) => (
                <span key={beat} className="hero-beat">
                  {beat}
                </span>
              ))}
            </p>
          </div>

          <div className="hero-cta">
            <a
              href="/projets"
              className="hero-cta-btn group relative inline-flex items-stretch focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="relative z-10 flex items-center bg-black px-6 py-3.5 font-display text-sm font-semibold tracking-[0.16em] uppercase text-white transition-[transform,background-color,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-black md:px-7 md:text-[0.8125rem]">
                Découvrir
              </span>
              <span
                aria-hidden
                className="relative z-10 flex w-12 items-center justify-center overflow-hidden bg-white text-black transition-[transform,background-color,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-black group-hover:text-white md:w-14"
              >
                <span className="hero-cta-arrow inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45">
                  →
                </span>
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 translate-x-1.5 translate-y-1.5 border border-black/40 transition-transform duration-300 ease-out group-hover:translate-x-2.5 group-hover:translate-y-2.5"
              />
            </a>
          </div>
        </div>

        <div className="hero-figure pointer-events-none relative flex w-full justify-center md:col-span-7 md:h-full md:items-end md:justify-end lg:col-span-7">
          <div className="hero-figure-float relative flex w-full max-w-[22rem] justify-center sm:max-w-[26rem] md:max-w-none md:w-full md:justify-end">
            <div className="hero-fig-slide hero-fig-slide--a relative">
              <Image
                src={SLIDES[0].figure}
                alt={SLIDES[0].alt}
                width={920}
                height={1100}
                priority
                className="h-[min(52dvh,480px)] w-auto max-w-full object-contain object-bottom drop-shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:h-[min(88dvh,900px)] md:max-w-[100%]"
                sizes="(max-width: 768px) 80vw, 55vw"
              />
            </div>
            <div className="hero-fig-slide hero-fig-slide--b absolute inset-x-0 bottom-0 flex justify-center md:justify-end">
              <Image
                src={SLIDES[1].figure}
                alt={SLIDES[1].alt}
                width={920}
                height={1100}
                priority
                className="h-[min(52dvh,480px)] w-auto max-w-full object-contain object-bottom drop-shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:h-[min(88dvh,900px)] md:max-w-[100%]"
                sizes="(max-width: 768px) 80vw, 55vw"
              />
            </div>
          </div>
        </div>
      </div>

      <a
        href="#methode"
        className="hero-scroll absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:bottom-8"
        aria-label="Défiler vers la section suivante"
      >
        <span className="text-[0.65rem] font-medium tracking-[0.28em] uppercase">
          Scroll
        </span>
        <span
          className="hero-scroll-chevron flex h-8 w-5 items-start justify-center"
          aria-hidden
        >
          <span className="block h-3 w-3 rotate-45 border-b-2 border-r-2 border-white" />
        </span>
      </a>
    </section>
  );
}
