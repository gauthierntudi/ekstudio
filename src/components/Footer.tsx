"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, NAV_LINKS, SOCIALS } from "@/data/site";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".footer-brand", ".footer-col", ".footer-bottom"], {
          autoAlpha: 1,
          y: 0,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          })
          .fromTo(
            ".footer-brand",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
          )
          .fromTo(
            ".footer-col",
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.35",
          )
          .fromTo(
            ".footer-bottom",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.5 },
            "-=0.2",
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="snap-section relative flex flex-col overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0">
        <Image
          src="/img/bg-black.png"
          alt=""
          fill
          className="object-cover opacity-90"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 py-24 md:px-10 md:py-20 lg:py-24">
        <div className="flex flex-1 flex-col justify-center gap-14 lg:gap-20">
          <div className="footer-brand max-w-2xl">
            <p className="max-w-[22ch] font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
              Là où l’image devient une{" "}
              <span className="text-[color:var(--accent)]">expérience</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-12">
            <div className="footer-col space-y-4">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/40">
                Explorer
              </p>
              <ul className="space-y-2">
                {NAV_LINKS.filter((l) => l.href !== "/contact").map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-display text-lg text-white transition-colors hover:text-[color:var(--accent)] md:text-xl"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col space-y-4">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/40">
                Contact
              </p>
              <div className="space-y-2 text-sm md:text-base">
                {CONTACT.emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="block text-white transition-colors hover:text-[color:var(--accent)]"
                  >
                    {email}
                  </a>
                ))}
                <div className="space-y-1 pt-1">
                  {CONTACT.phones.map((phone) => (
                    <a
                      key={phone.href}
                      href={phone.href}
                      className="block text-white/70 transition-colors hover:text-white"
                    >
                      {phone.label}
                    </a>
                  ))}
                </div>
                <p className="pt-1 text-white/55">
                  {CONTACT.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="footer-col col-span-2 space-y-4 sm:col-span-1">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/40">
                Suivre
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
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

            <div className="footer-col hidden space-y-4 lg:block">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/40">
                Studio
              </p>
              <p className="max-w-[18ch] text-sm leading-snug text-white/60">
                Laboratoire créatif au cœur de Kinshasa — depuis 2019.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.65rem] tracking-[0.08em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} EK studio. Tous droits réservés.</span>
          <span>Agence conseil &amp; communication</span>
        </div>
      </div>
    </footer>
  );
}
