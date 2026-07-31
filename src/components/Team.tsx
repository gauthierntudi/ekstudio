"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import Footer from "@/components/Footer";

type Member = {
  photo: string;
  index: string;
  name?: string;
  role?: string;
  profile?: string[];
};

const TEAM: Member[] = [
  {
    photo: "/team/1.png",
    index: "01",
    name: "KABUNDI Espérant",
    role: "Fondateur & Directeur Créatif",
    profile: [
      "Créateur dans l’âme, KABUNDI Espérant évolue depuis plus de 16 ans dans l’univers de l’image, du design et du storytelling visuel. Là où certains voient des formes et des pixels, lui perçoit des émotions, des récits et des opportunités de connexion entre les marques et leur public.",
      "Graphiste de formation, directeur artistique par passion, il développe une approche où l’esthétique ne se dissocie jamais de la stratégie. Chaque création est pensée comme un langage, chaque visuel comme un message porteur de sens.",
      "En fondant EK STUDIO en 2019 à Kinshasa, il pose une vision claire : créer un espace où la créativité rencontre l’exigence, où l’innovation sert l’impact, et où chaque projet devient une expérience singulière. Sous sa direction, le studio accompagne marques, institutions et entreprises dans la conception de supports de communication puissants, cohérents et mémorables.",
      "Donner une identité forte aux idées, sans jamais trahir l’ADN des marques.",
    ],
  },
  {
    photo: "/team/2.png",
    index: "02",
    name: "NDOMBELE Emmanuel",
    role: "Directeur Artistique",
    profile: [
      "Directeur artistique à l’œil affûté, NDOMBELE Emmanuel transforme les concepts en univers visuels forts et structurés. Son approche repose sur une parfaite maîtrise des codes graphiques, combinée à une sensibilité artistique nourrie par la culture visuelle contemporaine, le jeu vidéo et le storytelling.",
      "Chaque projet est pour lui une immersion totale : comprendre l’essence, révéler l’invisible et traduire l’intention en expérience visuelle. Il orchestre les couleurs, les formes et les contrastes comme on compose une mélodie, avec précision et émotion.",
      "Sa force réside dans sa capacité à capter rapidement l’âme d’un projet et à la matérialiser par une direction artistique claire, cohérente et impactante.",
    ],
  },
  {
    photo: "/team/3.png",
    index: "03",
    name: "KALALA Kyria",
    role: "Responsable Clientèle",
    profile: [
      "Responsable Clientèle, KALALA Kyria est le point de liaison stratégique entre les clients et les équipes créatives. Licenciée et dotée d’une solide expérience en communication, relations publiques, événementiel et gestion de la relation client, elle évolue avec aisance dans des environnements exigeants.",
      "Organisée, rigoureuse et orientée solutions, elle pilote les projets, coordonne les équipes et veille à la qualité de l’expérience client à chaque étape. Son rôle est essentiel : garantir des échanges fluides, une compréhension claire des besoins et une exécution alignée avec l’image et les valeurs du studio.",
    ],
  },
  {
    photo: "/team/4.png",
    index: "04",
    name: "BAMPANGIDI Clément",
    role: "Digital Manager",
  },
  {
    photo: "/team/5.png",
    index: "05",
    name: "NDALA Rabby",
    role: "Graphic Designer & Motion Design",
    profile: [
      "Formé à l’Académie des Beaux-Arts de Kinshasa, NDALA Rabby est animé par une quête permanente d’excellence graphique. Passionné par les arts visuels, il conjugue rigueur technique, sens du détail et créativité.",
      "Observateur, méthodique et collaboratif, il contribue à donner vie aux concepts du studio à travers des créations précises, harmonieuses et alignées avec les objectifs stratégiques des projets.",
    ],
  },
  {
    photo: "/team/6.png",
    index: "06",
    name: "ILUNGA Inès",
    role: "Graphiste & Créative Digitale",
    profile: [
      "Graphiste et créative passionnée par l’univers des marques, ILUNGA Inès imagine des identités visuelles audacieuses, expressives et résolument engageantes. Son terrain de jeu : le digital, le social media et la création d’univers graphiques qui captivent dès le premier regard.",
      "Si elle maîtrise le minimalisme, son cœur penche clairement pour le maximalisme assumé : des couleurs qui claquent, des compositions dynamiques et des visuels pensés pour attirer, retenir et marquer. Chaque création est conçue comme un outil de narration visuelle au service de la marque.",
    ],
  },
  {
    photo: "/team/7.png",
    index: "07",
    name: "ILDIO MAKAYA Destin",
    role: "Motion Designer",
    profile: [
      "Créatif spécialisé en réalisation audiovisuelle, motion design et design graphique, ILDIO MAKAYA Destin formé en communication visuelle à l’Académie des Beaux-Arts de Kinshasa (Graduat & Licence), il dispose d’une solide maîtrise des outils et des langages contemporains de l’image animée. Son expertise couvre la réalisation de vidéos, le motion design, la post-production et la création de contenus destinés aux supports digitaux et institutionnels.",
    ],
  },
  {
    photo: "/team/9.png",
    index: "08",
    name: "MATELA Sam",
    role: "Vidéaste Junior",
    profile: [
      "Vidéaste junior animé par une passion sincère pour l’image en mouvement. Curieux et créatif, il adopte une approche sensible et dynamique pour capturer les instants. En apprentissage continu, il développe progressivement son propre style cinématographique au fil des projets.",
    ],
  },
  {
    photo: "/team/10.png",
    index: "09",
    name: "MULENDA Tommy-Jordan",
    role: "Photographe",
    profile: [
      "À travers son objectif, MULENDA Tommy-Jordan capte l’essence de l’instant. Portraits, événements, mode ou documentaire : chaque image est une exploration de l’humain, de la lumière et de l’émotion.",
      "Sa photographie se distingue par une approche à la fois artistique et authentique, où chaque détail raconte une histoire. Plus qu’un métier, la photo est pour lui un moyen d’expression et de connexion.",
    ],
  },
  {
    photo: "/team/11.png",
    index: "10",
    name: "MPOLO Matthieu",
    role: "Photographe Junior",
    profile: [
      "Il explore la beauté du monde à travers son objectif avec un regard frais et curieux. Passionné par la lumière et la composition, il s’attache à capter l’authenticité des moments. À l’écoute et en constante quête de perfectionnement, il enrichit son univers visuel à travers chaque projet.",
    ],
  },
];

const DECODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*";
const DECODE_PAIRS = [
  { line1: "NOTRE", line2: "ÉQUIPE" },
  { line1: "BEST", line2: "CREW" },
] as const;
const DECODE_INTERVAL_MS = 5000;
const DECODE_DURATION_MS = 950;

function decodeFrame(target: string, progress: number) {
  return target
    .split("")
    .map((char, index) => {
      if (char === " ") return " ";
      const revealAt = (index + 0.35) / (target.length + 0.35);
      if (progress >= revealAt) return char;
      return DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)]!;
    })
    .join("");
}

function useDecodeLines(intervalMs = DECODE_INTERVAL_MS) {
  const [line1, setLine1] = useState<string>(DECODE_PAIRS[0].line1);
  const [line2, setLine2] = useState<string>(DECODE_PAIRS[0].line2);
  const pairIndex = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let timeoutId = 0;

    const run = () => {
      const nextIndex = (pairIndex.current + 1) % DECODE_PAIRS.length;
      const target = DECODE_PAIRS[nextIndex]!;
      const start = performance.now();

      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - start) / DECODE_DURATION_MS);
        setLine1(decodeFrame(target.line1, progress));
        setLine2(decodeFrame(target.line2, progress));

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
          return;
        }

        pairIndex.current = nextIndex;
        setLine1(target.line1);
        setLine2(target.line2);
        timeoutId = window.setTimeout(run, intervalMs);
      };

      frameId = requestAnimationFrame(tick);
    };

    timeoutId = window.setTimeout(run, intervalMs);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [intervalMs]);

  return { line1, line2 };
}

export default function Team() {
  const pageRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    startY: 0,
    deltaY: 0,
    pointerId: -1,
  });
  const [active, setActive] = useState<Member | null>(null);
  const panelTitleId = useId();
  const { line1, line2 } = useDecodeLines(DECODE_INTERVAL_MS);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".team-bg",
            ".team-heading",
            ".team-crew",
            ".team-scroll",
            ".team-cred",
            ".team-label",
            ".team-lead",
            ".team-card",
          ],
          { autoAlpha: 1, y: 0, scale: 1 },
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          ".team-bg",
          { autoAlpha: 0, scale: 1.04 },
          { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        )
          .fromTo(
            ".team-crew",
            { autoAlpha: 0, scale: 1.06 },
            { autoAlpha: 1, scale: 1, duration: 1.05, ease: "power2.out" },
            "-=0.85",
          )
          .fromTo(
            ".team-heading",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            "-=0.45",
          )
          .fromTo(
            ".team-scroll",
            { autoAlpha: 0, y: -8 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            "-=0.25",
          )
          .fromTo(
            ".team-cred",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.3",
          );

        gsap.to(".team-scroll-chevron", {
          y: 6,
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.4,
        });

        gsap.fromTo(
          ".team-label",
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: ".team-roster",
              start: "top 80%",
              once: true,
            },
          },
        );

        gsap.fromTo(
          ".team-lead",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            delay: 0.08,
            scrollTrigger: {
              trigger: ".team-roster",
              start: "top 80%",
              once: true,
            },
          },
        );

        gsap.fromTo(
          ".team-card",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.05,
            scrollTrigger: {
              trigger: ".team-roster",
              start: "top 75%",
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: pageRef },
  );

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || !active) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      gsap.set(panel, { display: "flex" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        panel,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.28, ease: "power2.out" },
      );

      if (isMobile) {
        tl.fromTo(
          ".team-profile-panel",
          { y: "100%" },
          { y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.12",
        );
      } else {
        tl.fromTo(
          ".team-profile-panel",
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          "-=0.1",
        );
      }
    },
    { dependencies: [active], scope: pageRef, revertOnUpdate: false },
  );

  useEffect(() => {
    if (!active) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProfile();
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const closeProfile = () => {
    const panel = panelRef.current;
    const sheet = sheetRef.current;
    if (!panel) {
      setActive(null);
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile && sheet) {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { display: "none" });
          gsap.set(sheet, { clearProps: "transform" });
          setActive(null);
        },
      });
      tl.to(sheet, { y: "100%", duration: 0.35, ease: "power2.in" }).to(
        panel,
        { autoAlpha: 0, duration: 0.2, ease: "power2.in" },
        "-=0.12",
      );
      return;
    }

    gsap.to(panel, {
      autoAlpha: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(panel, { display: "none" });
        setActive(null);
      },
    });
  };

  const scrollToRoster = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const roster = document.getElementById("roster");
    if (!roster) return;

    gsap.to(window, {
      duration: 1.35,
      ease: "power2.inOut",
      scrollTo: {
        y: roster,
        offsetY: 0,
        autoKill: true,
      },
      overwrite: true,
    });
  };

  const onHandlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    dragRef.current = {
      active: true,
      startY: event.clientY,
      deltaY: 0,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    gsap.killTweensOf(sheet);
    gsap.killTweensOf(panelRef.current);
  };

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;

    const sheet = sheetRef.current;
    const panel = panelRef.current;
    if (!sheet || !panel) return;

    const deltaY = Math.max(0, event.clientY - drag.startY);
    drag.deltaY = deltaY;
    gsap.set(sheet, { y: deltaY });

    const progress = Math.min(1, deltaY / 260);
    gsap.set(panel, { autoAlpha: 1 - progress * 0.55 });
  };

  const onHandlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;

    const sheet = sheetRef.current;
    const panel = panelRef.current;
    drag.active = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const deltaY = drag.deltaY;

    // Tap on handle → close
    if (deltaY < 8) {
      closeProfile();
      return;
    }

    // Drag past threshold → dismiss
    if (deltaY > 110) {
      closeProfile();
      return;
    }

    // Snap back
    gsap.to(sheet, { y: 0, duration: 0.4, ease: "power3.out" });
    gsap.to(panel, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <main ref={pageRef} className="relative bg-black text-white">
      <section
        className="team-visual relative flex min-h-dvh flex-col overflow-hidden"
        aria-label="Notre équipe — Best crew"
      >
        <div className="team-bg absolute inset-0">
          <Image
            src="/img/bg-black.png"
            alt=""
            fill
            priority
            className="object-cover brightness-[1.35] contrast-110 saturate-90"
            sizes="100vw"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 md:pointer-events-auto md:static md:mx-auto md:block md:w-full md:max-w-7xl md:items-stretch md:justify-start md:px-10 md:pt-32">
          <div className="-translate-y-20 md:translate-y-0">
            <h1 className="team-heading max-w-[9ch] text-center font-display text-[clamp(2.35rem,12vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] uppercase text-white md:max-w-[10ch] md:text-left md:text-[clamp(1.35rem,3.2vw,2.25rem)] md:leading-[1.05]">
              <span className="sr-only">Notre équipe — Best crew</span>
              <span aria-hidden="true" className="block">
                {line1}
              </span>
              <span
                aria-hidden="true"
                className="block text-[color:var(--accent)]"
              >
                {line2}
              </span>
            </h1>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center overflow-hidden md:overflow-visible md:px-6">
          <div className="team-crew relative h-[min(48dvh,420px)] w-[138%] max-w-none shrink-0 md:aspect-[1552/812] md:h-auto md:w-full md:max-w-[min(100%,1500px)]">
            <Image
              src="/img/crew.png"
              alt="EK STUDIO — Best crew"
              fill
              priority
              className="object-contain object-bottom"
              sizes="(max-width: 768px) 140vw, 100vw"
            />
          </div>
        </div>

        <a
          href="#roster"
          onClick={scrollToRoster}
          className="team-scroll absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:bottom-8 md:gap-2"
          aria-label="Défiler vers l’équipe"
        >
          <span className="text-[0.6rem] font-medium tracking-[0.28em] uppercase md:text-[0.65rem]">
            Scroll
          </span>
          <span
            className="team-scroll-chevron flex h-7 w-5 items-start justify-center md:h-8"
            aria-hidden
          >
            <span className="block h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-white md:h-3 md:w-3" />
          </span>
        </a>

        <a
          href="#roster"
          onClick={scrollToRoster}
          className="team-cred absolute right-5 bottom-10 z-20 hidden flex-col items-center gap-3 text-white/40 transition-colors hover:text-white md:right-10 md:flex"
          aria-label="Voir l’équipe"
        >
          <span className="origin-center -rotate-180 text-[0.65rem] font-medium tracking-[0.28em] uppercase [writing-mode:vertical-rl]">
            Credentials 2025
          </span>
          <span aria-hidden>↓</span>
        </a>
      </section>

      <section
        id="roster"
        className="team-roster relative isolate overflow-hidden scroll-mt-20"
      >
        <div className="pointer-events-none absolute inset-0 z-0 md:hidden" aria-hidden>
          <Image
            src="/img/bg-grey.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden bg-[url('/img/bg-grey.png')] bg-cover bg-center bg-no-repeat bg-fixed md:block"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-xl">
            <p className="team-label text-[0.7rem] font-medium tracking-[0.22em] uppercase text-white/45">
              Équipe
            </p>
            <p className="team-lead mt-4 max-w-lg font-display text-[clamp(1.15rem,2.8vw,1.65rem)] font-semibold leading-[1.2] tracking-[-0.02em] uppercase text-white">
              Des talents confirmés
              <br />
              et émergents,
              <br />
              unis par une vision commune :
              <br />
              <span className="text-[#00f306]">
                Créer de l’impact par l’image.
              </span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:mt-16 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {TEAM.map((member) => {
              const hasProfile = Boolean(member.name && member.profile?.length);
              const label = member.name
                ? `${member.name} — ${member.role ?? ""}`
                : `Membre de l’équipe ${member.index}`;

              const inner = (
                <>
                  <div className="relative aspect-[805/830] w-full overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={label}
                      fill
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                  <div className="mt-3 text-center md:mt-4">
                    {member.name ? (
                      <>
                        <p className="font-display text-sm font-semibold tracking-[-0.02em] uppercase text-white md:text-[0.95rem]">
                          {member.name}
                        </p>
                        {member.role ? (
                          <p className="mt-1 text-[0.7rem] leading-snug tracking-[0.04em] text-white/55 md:text-xs">
                            {member.role}
                          </p>
                        ) : null}
                        {hasProfile ? (
                          <p className="mt-2 text-[0.65rem] tracking-[0.18em] uppercase text-[color:var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            Profil
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-[0.65rem] tracking-[0.18em] text-white/40">
                        {member.index}
                      </p>
                    )}
                  </div>
                </>
              );

              if (hasProfile) {
                return (
                  <button
                    key={member.photo}
                    type="button"
                    className="team-card group relative w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    onClick={() => setActive(member)}
                    aria-haspopup="dialog"
                  >
                    {inner}
                  </button>
                );
              }

              return (
                <article key={member.photo} className="team-card group relative">
                  {inner}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <div
        ref={panelRef}
        className="fixed inset-0 z-50 hidden items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby={panelTitleId}
        style={{ opacity: 0, visibility: "hidden" }}
        onClick={closeProfile}
      >
        {active ? (
          <div
            ref={sheetRef}
            className="team-profile-panel relative flex h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-[#111111] md:h-auto md:max-h-[88dvh] md:flex-row md:rounded-none"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="relative z-20 flex w-full shrink-0 touch-none flex-col items-center pt-3 pb-3 md:hidden"
              aria-label="Fermer le profil"
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
            >
              <span className="h-1 w-10 rounded-full bg-white/35" aria-hidden />
            </button>

            <button
              type="button"
              onClick={closeProfile}
              className="absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white/70 transition-colors hover:border-white hover:text-white md:top-4 md:right-4"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain md:flex-row md:overflow-hidden">
              <div className="relative flex shrink-0 items-start justify-center px-6 pt-2 pb-2 md:w-[42%] md:px-8 md:pt-16 md:pb-12">
                <div className="relative aspect-[805/830] w-[68%] max-w-[18rem] md:w-full md:max-w-none">
                  <Image
                    src={active.photo}
                    alt={active.name ?? ""}
                    fill
                    className="object-contain object-top"
                    sizes="(max-width: 768px) 68vw, 360px"
                    priority
                  />
                </div>
              </div>

              <div className="relative min-h-0 flex-1 px-6 pt-2 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:overflow-y-auto md:px-10 md:pt-16 md:pb-12">
                <p className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-white/45">
                  Profil
                </p>
                <h2
                  id={panelTitleId}
                  className="mt-3 font-display text-[clamp(1.5rem,3.5vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.03em] uppercase text-white"
                >
                  {active.name}
                </h2>
                {active.role ? (
                  <p className="mt-2 text-sm text-[color:var(--accent)] md:text-base">
                    {active.role}
                  </p>
                ) : null}

                <div className="mt-6 space-y-5 text-sm leading-relaxed text-white/70 md:mt-10 md:text-[0.95rem] md:leading-relaxed">
                  {active.profile?.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === (active.profile?.length ?? 0) - 1
                          ? "font-medium text-white/90"
                          : undefined
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
