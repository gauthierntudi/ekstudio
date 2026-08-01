"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const CLIENTS = [
  "/clients/01.png",
  "/clients/02.png",
  "/clients/03.png",
  "/clients/04.png",
  "/clients/05.png",
  "/clients/06.png",
  "/clients/07.png",
  "/clients/08.png",
  "/clients/09.png",
  "/clients/010.png",
  "/clients/011.png",
  "/clients/012.png",
  "/clients/013.png",
  "/clients/014.png",
  "/clients/015.png",
];

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".clients-label", ".clients-title", ".clients-logo"], {
          autoAlpha: 1,
          y: 0,
        });
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
            ".clients-label",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
          )
          .fromTo(
            ".clients-title",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "-=0.2",
          )
          .fromTo(
            ".clients-logo",
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.04,
              ease: "power2.out",
            },
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
      id="clients"
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

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 py-20 md:px-10 md:py-16">
        <p className="clients-label text-left text-[0.7rem] font-medium tracking-[0.22em] uppercase text-black/40">
          Clients
        </p>
        <h2 className="clients-title mt-4 max-w-[16ch] text-left font-display text-[clamp(1.55rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] uppercase text-black">
          Ils nous font{" "}
          <span className="text-[color:var(--accent)]">confiance</span>
        </h2>

        <ul className="mt-12 grid grid-cols-3 gap-x-5 gap-y-7 sm:gap-x-8 sm:gap-y-10 md:mt-16 md:grid-cols-4 md:gap-x-10 md:gap-y-12 lg:grid-cols-5">
          {CLIENTS.map((src) => (
            <li
              key={src}
              className="clients-logo relative flex h-9 items-center justify-center sm:h-12 md:h-16"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 hover:grayscale-0 hover:opacity-100"
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 160px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
