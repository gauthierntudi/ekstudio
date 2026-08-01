"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const SERVICE_ICONS = [
  "/img/icons/ICO_EK-09.png",
  "/img/icons/ICO_EK-10.png",
  "/img/icons/ICO_EK-11.png",
  "/img/icons/ICO_EK-12.png",
  "/img/icons/ICO_EK-13.png",
  "/img/icons/ICO_EK-14.png",
  "/img/icons/ICO_EK-15.png",
] as const;

const SERVICE_LINES = [
  ["L’identité visuelle", "La création de contenus"],
  ["Conceptions graphiques", "La stratégie de communication"],
  ["Le marketing digital", "La photographie"],
  ["La vidéographie", "Live streaming"],
] as const;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".services-intro",
            ".services-icon",
            ".services-line",
            ".services-deco",
            ".services-cred",
            ".services-dots",
          ],
          { autoAlpha: 1, y: 0, scale: 1 },
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          })
          .fromTo(
            ".services-intro",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out" },
          )
          .fromTo(
            ".services-icon",
            { autoAlpha: 0, y: 20, scale: 0.9 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: "power2.out",
            },
            "-=0.25",
          )
          .fromTo(
            ".services-line",
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.2",
          )
          .fromTo(
            ".services-deco",
            { autoAlpha: 0, scale: 0.85 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.45",
          )
          .fromTo(
            [".services-cred", ".services-dots"],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4 },
            "-=0.35",
          );

        gsap.to(".services-deco-arrow-motion", {
          y: 10,
          x: 6,
          rotation: 4,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to(".services-deco-crown-motion", {
          y: -8,
          x: -5,
          rotation: -3,
          duration: 4.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.4,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="snap-section relative overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0">
        <Image
          src="/img/bg-black.png"
          alt=""
          fill
          className="object-cover brightness-[1.35] contrast-110 saturate-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      </div>

      {/* Arrow deco — top left */}
      <div className="services-deco pointer-events-none absolute top-[6%] left-1 z-10 h-20 w-20 sm:left-[2%] sm:h-28 sm:w-28 md:top-[10%] md:left-[4%] md:h-40 md:w-40 lg:h-48 lg:w-48">
        <div className="services-deco-arrow-motion relative h-full w-full will-change-transform">
          <Image
            src="/img/icons/ICO_EK-06.png"
            alt=""
            fill
            className="object-contain"
            sizes="192px"
          />
        </div>
      </div>

      {/* Crown deco — bottom right */}
      <div className="services-deco pointer-events-none absolute right-1 bottom-[8%] z-10 h-16 w-16 sm:right-[3%] sm:bottom-[10%] sm:h-24 sm:w-24 md:right-[5%] md:bottom-[12%] md:h-36 md:w-36 lg:h-44 lg:w-44">
        <div className="services-deco-crown-motion relative h-full w-full will-change-transform">
          <Image
            src="/img/icons/ICO_EK-01.png"
            alt=""
            fill
            className="object-contain"
            sizes="176px"
          />
        </div>
      </div>

      {/* Credentials — bottom left */}
      <div className="services-cred absolute bottom-10 left-6 z-20 hidden flex-col items-center gap-3 md:left-10 md:flex">
        <span className="origin-center -rotate-180 text-[0.65rem] font-medium tracking-[0.28em] uppercase text-white/40 [writing-mode:vertical-rl]">
          Credentials 2025
        </span>
        <span aria-hidden className="text-white/35">
          ↓
        </span>
      </div>

      {/* Dots — top right */}
      <div
        className="services-dots absolute top-24 right-6 z-20 hidden flex-col items-center gap-2 md:right-10 md:flex"
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-white/45" />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-6 py-20 text-center md:px-10 md:py-16">
        <p className="services-intro max-w-[42ch] text-[0.9375rem] leading-snug text-white/85 md:text-lg md:leading-snug">
          EK STUDIO propose une large gamme de services en matière de
          communication visuelle et de création de contenus.
        </p>

        <ul className="mt-10 flex w-full max-w-[20rem] flex-wrap justify-center gap-x-5 gap-y-6 sm:max-w-none sm:gap-6 md:mt-14 md:gap-8 lg:gap-10">
          {SERVICE_ICONS.map((src) => (
            <li
              key={src}
              className="services-icon relative h-16 w-16 shrink-0 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[4.5rem] lg:w-[4.5rem]"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-contain"
                sizes="72px"
              />
            </li>
          ))}
        </ul>

        <ul className="mt-10 space-y-0.5 md:mt-14 md:space-y-1">
          {SERVICE_LINES.map((pair) => (
            <li
              key={pair.join("-")}
              className="services-line font-display text-[clamp(0.7rem,2.2vw,1.05rem)] font-semibold leading-tight tracking-[0.06em] uppercase text-white"
            >
              <span>{pair[0]}</span>
              <span className="mx-2 text-white/35 md:mx-3" aria-hidden>
                |
              </span>
              <span>{pair[1]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
