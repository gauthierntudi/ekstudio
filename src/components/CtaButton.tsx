import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "dark" | "accent" | "outline";
type Size = "md" | "sm";

const LABEL: Record<Variant, string> = {
  dark: "bg-black text-white group-hover:text-black",
  accent: "bg-[color:var(--accent)] text-black group-hover:text-black",
  outline: "border border-white/35 text-white group-hover:text-black",
};

const FILL: Record<Variant, string> = {
  dark: "bg-white",
  accent: "bg-white",
  outline: "bg-white",
};

const ARROW: Record<Variant, string> = {
  dark: "bg-white text-black group-hover:bg-black group-hover:text-white",
  accent:
    "bg-white text-black group-hover:bg-[color:var(--accent)] group-hover:text-black",
  outline:
    "border border-white/35 text-white group-hover:border-white group-hover:bg-white group-hover:text-black",
};

const LABEL_SIZE: Record<Size, string> = {
  md: "px-6 py-3.5 text-sm md:px-7",
  sm: "px-3 py-3 text-[0.7rem] sm:px-6 sm:py-3.5 sm:text-sm md:px-7",
};

const ARROW_SIZE: Record<Size, string> = {
  md: "w-12 md:w-14",
  sm: "w-9 sm:w-12 md:w-14",
};

const EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Stretch to the parent width (grid / column layouts). */
  block?: boolean;
  className?: string;
};

export default function CtaButton({
  href,
  children,
  variant = "dark",
  size = "md",
  block = false,
  className = "",
}: Props) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const classes = `group relative isolate inline-flex min-w-0 items-stretch gap-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
    block ? "w-full" : ""
  } ${className}`;

  const content = (
    <>
      <span
        className={`relative flex min-w-0 flex-1 items-center overflow-hidden font-sans font-bold tracking-[-0.01em] transition-colors ${EASE} ${LABEL[variant]} ${LABEL_SIZE[size]}`}
      >
        {/* Fill that sweeps in from the left on hover */}
        <span
          aria-hidden
          className={`absolute inset-0 origin-left scale-x-0 transition-transform ${EASE} group-hover:scale-x-100 group-focus-visible:scale-x-100 ${FILL[variant]}`}
        />
        <span className="relative">{children}</span>
      </span>
      <span
        aria-hidden
        className={`relative flex shrink-0 items-center justify-center overflow-hidden transition-colors ${EASE} ${ARROW[variant]} ${ARROW_SIZE[size]}`}
      >
        {/* Arrow exits right while a twin enters from the left */}
        {/* Both twins span the whole box, so ±100% moves them fully out of view */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-transform ${EASE} group-hover:translate-x-full`}
        >
          <Arrow />
        </span>
        <span
          className={`absolute inset-0 flex -translate-x-full items-center justify-center transition-transform ${EASE} group-hover:translate-x-0`}
        >
          <Arrow />
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
