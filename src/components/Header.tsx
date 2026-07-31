"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, NAV_LINKS, SOCIALS } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".site-header-inner",
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.15 },
      );
    },
    { scope: headerRef },
  );

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      if (open) {
        gsap.set(panel, { display: "flex" });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          panel,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
        )
          .fromTo(
            ".nav-link",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 },
            "-=0.1",
          )
          .fromTo(
            ".menu-footer-item",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 },
            "-=0.25",
          );
      } else {
        gsap.to(panel, {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(panel, { display: "none" });
          },
        });
      }
    },
    { dependencies: [open], scope: headerRef, revertOnUpdate: false },
  );

  useEffect(() => {
    const lightSections = ["studio", "clients"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!lightSections.length) return;

    const visible = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        });
        setOnLight(visible.size > 0);
      },
      { threshold: [0.45, 0.6] },
    );

    lightSections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header ref={headerRef} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`site-header-inner pointer-events-auto relative z-50 mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 transition-colors duration-300 md:h-20 md:px-10 ${
          onLight && !open ? "text-black" : "text-white"
        }`}
      >
        <Link
          href="/"
          className="relative block w-[9.5rem] shrink-0 md:w-[11.5rem]"
          aria-label="EK studio — accueil"
        >
          <Image
            src={onLight && !open ? "/img/logo-ek.png" : "/img/logo-ek-white.png"}
            alt="EK studio"
            width={2437}
            height={684}
            priority
            className="h-auto w-full object-left object-contain"
          />
        </Link>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Fermer" : "Menu"}</span>
          <span className="relative block h-3.5 w-6" aria-hidden>
            <span
              className={`absolute left-0 top-0 block h-[2px] w-full bg-current transition-transform duration-300 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] block h-[2px] w-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[12px] block h-[2px] w-full bg-current transition-transform duration-300 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        ref={panelRef}
        id={panelId}
        className="pointer-events-auto fixed inset-0 z-40 hidden h-dvh flex-col overflow-hidden bg-black"
        style={{ opacity: 0 }}
        aria-hidden={!open}
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/img/bg-black.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />
        </div>

        <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col px-6 pt-20 md:px-10 md:pt-24">
          {/* Zone principale — navigation */}
          <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden border-b border-white/15 pb-6 md:justify-center md:pb-8">
            <p className="mb-3 shrink-0 text-[0.7rem] font-medium tracking-[0.22em] uppercase text-white/45 md:mb-5">
              Menu
            </p>
            <nav
              className="flex min-h-0 flex-col justify-end gap-0 overflow-y-auto md:gap-1"
              aria-label="Navigation principale"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link group flex items-baseline gap-3 py-0.5 text-white md:gap-5"
                  onClick={() => setOpen(false)}
                >
                  <span className="w-5 shrink-0 text-[0.65rem] tracking-[0.14em] text-white/35 transition-colors group-hover:text-[color:var(--accent)] md:w-6 md:text-xs">
                    {link.index}
                  </span>
                  <span className="font-display text-[clamp(1.85rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-[color:var(--accent)]">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Zone footer — infos */}
          <footer className="shrink-0 py-5 md:py-7">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4 lg:gap-8">
              <div className="menu-footer-item space-y-1.5">
                <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                  Studio
                </p>
                <p className="max-w-[20ch] text-sm leading-snug text-white/80">
                  {CONTACT.tagline}
                </p>
              </div>

              <div className="menu-footer-item space-y-1.5">
                <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                  Contact
                </p>
                <a
                  href={`mailto:${CONTACT.emails[0]}`}
                  className="block text-sm text-white transition-colors hover:text-[color:var(--accent)]"
                >
                  {CONTACT.emails[0]}
                </a>
                <a
                  href={`mailto:${CONTACT.emails[1]}`}
                  className="block text-sm text-white transition-colors hover:text-[color:var(--accent)]"
                >
                  {CONTACT.emails[1]}
                </a>
                {CONTACT.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="block text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {phone.label}
                  </a>
                ))}
              </div>

              <div className="menu-footer-item space-y-1.5">
                <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                  Adresse
                </p>
                <p className="text-sm leading-snug text-white/80">
                  {CONTACT.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <div className="menu-footer-item space-y-2">
                <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                  Suivre
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {SOCIALS.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white transition-colors hover:text-[color:var(--accent)]"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="menu-footer-item mt-5 flex flex-col gap-1 border-t border-white/10 pt-4 text-[0.65rem] tracking-[0.08em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} EK studio</span>
              <span>Agence conseil &amp; communication</span>
            </div>
          </footer>
        </div>
      </div>
    </header>
  );
}
