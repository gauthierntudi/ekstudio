export const NAV_LINKS = [
  { href: "/", label: "Accueil", index: "01" },
  { href: "/methode", label: "Méthode", index: "02" },
  { href: "#clients", label: "Clients", index: "03" },
  { href: "/projets", label: "Projets", index: "04" },
  { href: "/equipe", label: "Équipe", index: "05" },
  { href: "/contact", label: "Contact", index: "06" },
] as const;

export const SOCIALS = [
  {
    href: "https://www.instagram.com/ekstudio_cd",
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@ekstudio_cd",
    label: "YouTube",
  },
  {
    href: "https://www.facebook.com/EKStudioCD",
    label: "Facebook",
  },
] as const;

export const CONTACT = {
  emails: ["contact@ekstudio-cd.com", "hello@ek-studio-cd.com"],
  phones: [
    { label: "+243 810 325 598", href: "tel:+243810325598" },
    { label: "+243 995 017 150", href: "tel:+243995017150" },
  ],
  address: [
    "Blvd 30 juin Imm Golf 6e Niveau",
    "Kinshasa-Gombe",
    "RD Congo",
  ],
  tagline: "Là où l’image devient une expérience.",
} as const;
