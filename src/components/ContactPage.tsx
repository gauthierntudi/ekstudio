"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, SOCIALS } from "@/data/site";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const pageRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".contact-label",
            ".contact-title",
            ".contact-lead",
            ".contact-block",
            ".contact-cta",
          ],
          { autoAlpha: 1, y: 0 },
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          ".contact-label",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
        )
          .fromTo(
            ".contact-title",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.75 },
            "-=0.2",
          )
          .fromTo(
            ".contact-lead",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            "-=0.35",
          )
          .fromTo(
            ".contact-block",
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.1,
            },
            "-=0.25",
          )
          .fromTo(
            ".contact-cta",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.2",
          );
      });

      return () => mm.revert();
    },
    { scope: pageRef },
  );

  return (
    <main ref={pageRef} className="relative bg-black text-white">
      <section className="relative isolate min-h-svh overflow-hidden md:min-h-dvh">
        <div className="pointer-events-none absolute inset-0 z-0 md:hidden" aria-hidden>
          <Image
            src="/img/bg-orange.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden bg-[url('/img/bg-orange.png')] bg-cover bg-center bg-no-repeat bg-fixed md:block"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-6 py-28 md:min-h-dvh md:px-10 md:py-32">
          <p className="contact-label text-[0.7rem] font-medium tracking-[0.22em] uppercase text-white/45">
            Contact
          </p>
          <h1 className="contact-title mt-4 max-w-[14ch] font-display text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] uppercase text-white">
            Parlons de
            <br />
            votre{" "}
            <span className="text-black">projet</span>
          </h1>
          <p className="contact-lead mt-6 max-w-lg text-base leading-snug text-white/65 md:mt-8 md:text-lg">
            {CONTACT.tagline} Écrivez-nous ou passez au studio — Kinshasa-Gombe.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-14">
            <div className="contact-block space-y-3">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                Email
              </p>
              <div className="space-y-2">
                {CONTACT.emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="block font-display text-lg text-white transition-colors hover:text-[color:var(--accent)] md:text-xl"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-block space-y-3">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                Téléphone
              </p>
              <div className="space-y-2">
                {CONTACT.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="block font-display text-lg text-white transition-colors hover:text-[color:var(--accent)] md:text-xl"
                  >
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-block space-y-3 sm:col-span-2 lg:col-span-1">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                Studio
              </p>
              <p className="font-display text-lg leading-snug text-white md:text-xl">
                {CONTACT.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="contact-block mt-12 space-y-3 lg:mt-16">
            <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
              Suivre
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white transition-colors hover:text-[color:var(--accent)] md:text-base"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-cta mt-12 md:mt-16">
            <a
              href={`mailto:${CONTACT.emails[0]}`}
              className="group relative inline-flex"
            >
              <span
                aria-hidden
                className="absolute top-1.5 left-1.5 h-full w-full border border-white bg-transparent transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
              <span className="relative z-10 flex items-center bg-black px-6 py-3.5 font-display text-sm font-semibold tracking-[0.16em] uppercase text-white transition-[transform,background-color,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-black md:px-7 md:text-[0.8125rem]">
                Écrire au studio
              </span>
              <span
                aria-hidden
                className="relative z-10 flex w-12 items-center justify-center overflow-hidden bg-white text-black transition-[transform,background-color,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-black group-hover:text-white md:w-14"
              >
                →
              </span>
            </a>
          </div>

          <p className="contact-block mt-10 text-sm text-white/40">
            Ou{" "}
            <Link
              href="/equipe"
              className="text-white/70 underline-offset-4 transition-colors hover:text-[color:var(--accent)] hover:underline"
            >
              découvrez l’équipe
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
