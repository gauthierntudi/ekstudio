# EKSTUDIO

Site Next.js + GSAP.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + TypeScript
- **Tailwind CSS 4**
- **GSAP** + `@gsap/react` (`useGSAP`)

## Démarrer

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/           # routes App Router
  components/    # UI + animations client
  lib/gsap.ts    # registerPlugin (useGSAP, ScrollTrigger)
public/
  clients/       # logos clients
  img/           # visuels brand
  team/          # portraits équipe
```

## GSAP (Next.js)

Les animations vivent dans des composants `"use client"`. Utiliser `useGSAP` avec un `scope` (ref) — pas de GSAP pendant le SSR.

```tsx
import { gsap, useGSAP } from "@/lib/gsap";

useGSAP(() => {
  gsap.from(".item", { autoAlpha: 0, y: 20, stagger: 0.1 });
}, { scope: containerRef });
```
