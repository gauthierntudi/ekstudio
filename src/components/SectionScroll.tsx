"use client";

import { useEffect, useRef } from "react";
import { gsap, Observer } from "@/lib/gsap";

const SECTION_SELECTOR = ".snap-section";

export default function SectionScroll() {
  const animating = useRef(false);
  const current = useRef(0);
  const lastNavAt = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getSections = () =>
      gsap.utils.toArray<HTMLElement>(SECTION_SELECTOR);

    if (reduced) {
      const id = window.location.hash.replace(/^#/, "");
      if (id) {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "auto" });
        });
      }
      return;
    }

    const isMobile = () =>
      window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;

    // Trackpad / Magic Mouse keep emitting inertial wheel events for ~1s after a
    // swipe. Navigation stays locked until the wheel has been quiet for a moment,
    // so one gesture = one section (no double jumps, no mid-tween restarts).
    const WHEEL_QUIET_MS = 180;
    let wheelLocked = false;
    let quietTimer: ReturnType<typeof setTimeout> | undefined;
    const armWheelUnlock = () => {
      clearTimeout(quietTimer);
      quietTimer = setTimeout(() => {
        if (animating.current) armWheelUnlock();
        else wheelLocked = false;
      }, WHEEL_QUIET_MS);
    };
    const onAnyWheel = () => {
      if (wheelLocked) armWheelUnlock();
    };

    const goTo = (index: number) => {
      const sections = getSections();
      if (!sections.length || animating.current) return false;

      const now = performance.now();
      if (now - lastNavAt.current < 280) return false;

      const next = gsap.utils.clamp(0, sections.length - 1, index);
      if (
        next === current.current &&
        Math.abs(window.scrollY - sections[next].offsetTop) < 8
      ) {
        return false;
      }

      const mobile = isMobile();
      animating.current = true;
      current.current = next;
      lastNavAt.current = now;
      wheelLocked = true;

      gsap.to(window, {
        duration: mobile ? 0.7 : 1.05,
        ease: mobile ? "power3.out" : "power4.inOut",
        scrollTo: {
          y: sections[next],
          autoKill: false,
        },
        overwrite: true,
        onComplete: () => {
          animating.current = false;
          current.current = next;
          armWheelUnlock();
        },
      });

      return true;
    };

    const syncIndex = () => {
      const sections = getSections();
      if (!sections.length) return;
      const mid = window.scrollY + window.innerHeight * 0.45;
      let closest = 0;
      let min = Infinity;
      sections.forEach((section, i) => {
        const center = section.offsetTop + section.offsetHeight * 0.5;
        const dist = Math.abs(center - mid);
        if (dist < min) {
          min = dist;
          closest = i;
        }
      });
      current.current = closest;
    };

    const menuOpen = () => document.body.style.overflow === "hidden";
    const canNavigate = () => !menuOpen() && !animating.current;
    const canWheel = () => canNavigate() && !wheelLocked;

    syncIndex();

    const wheelObserver = Observer.create({
      type: "wheel",
      tolerance: 30,
      preventDefault: true,
      onDown: () => {
        if (!canWheel()) return;
        goTo(current.current + 1);
      },
      onUp: () => {
        if (!canWheel()) return;
        goTo(current.current - 1);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (menuOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target;
      if (
        el instanceof Element &&
        el.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }
      const nextKeys = ["ArrowDown", "PageDown", " "];
      const prevKeys = ["ArrowUp", "PageUp"];
      let target: number | null = null;
      if (nextKeys.includes(e.key) && !(e.key === " " && e.shiftKey)) target = current.current + 1;
      else if (prevKeys.includes(e.key) || (e.key === " " && e.shiftKey)) target = current.current - 1;
      else if (e.key === "Home") target = 0;
      else if (e.key === "End") target = getSections().length - 1;
      if (target === null) return;
      e.preventDefault();
      if (!animating.current) goTo(target);
    };

    const touchObserver = Observer.create({
      type: "touch",
      tolerance: 10,
      preventDefault: true,
      ignore: ".values-track, .values-track *, .team-track, .team-track *",
      onUp: () => {
        if (!canNavigate()) return;
        goTo(current.current + 1);
      },
      onDown: () => {
        if (!canNavigate()) return;
        goTo(current.current - 1);
      },
    });

    const goToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const sections = getSections();
      const index = sections.findIndex((s) => s.id === id);
      if (index < 0) return;
      animating.current = false;
      lastNavAt.current = 0;
      // Delay so Next.js client navigation / layout can settle
      gsap.delayedCall(0.08, () => {
        goTo(index);
      });
    };

    goToHash();

    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a[href*='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      const hashIndex = href.indexOf("#");
      if (hashIndex < 0) return;
      const id = href.slice(hashIndex + 1);
      if (!id) return;

      const path = href.slice(0, hashIndex);
      const onHome =
        window.location.pathname === "/" || window.location.pathname === "";
      const targetsHome =
        path === "" || path === "/" || path === window.location.pathname;

      if (!onHome || !targetsHome) return;

      const sections = getSections();
      const index = sections.findIndex((s) => s.id === id);
      if (index < 0) return;

      e.preventDefault();
      history.pushState(null, "", `#${id}`);
      animating.current = false;
      goTo(index);
    };

    const onResize = () => {
      syncIndex();
    };

    // Keep index accurate after iOS URL bar show/hide
    const onScrollEnd = () => {
      if (!animating.current) syncIndex();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onAnyWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScrollEnd, { passive: true });
    window.addEventListener("hashchange", goToHash);
    document.addEventListener("click", onAnchorClick);

    return () => {
      wheelObserver.kill();
      touchObserver.kill();
      clearTimeout(quietTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onAnyWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScrollEnd);
      window.removeEventListener("hashchange", goToHash);
      document.removeEventListener("click", onAnchorClick);
      gsap.killTweensOf(window);
    };
  }, []);

  return null;
}
