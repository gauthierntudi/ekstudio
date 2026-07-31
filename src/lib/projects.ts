import fs from "fs";
import path from "path";

export type Project = {
  slug: string;
  title: string;
  cover: string;
  images: string[];
  year: string;
  tags: string[];
  subtitle: string;
};

const TITLE_MAP: Record<string, string> = {
  beaufort: "Beaufort",
  "canal-plus": "Canal+",
  castel: "Castel",
  easytv: "EasyTV",
  fanaf: "FANAF",
  "mutzig-class": "Mutzig Class",
  nkoyi: "Nkoyi",
  "top-tropical": "Top Tropical",
  "world-cola": "World Cola",
};

const META_MAP: Record<
  string,
  { year: string; tags: string[]; subtitle: string }
> = {
  beaufort: {
    year: "2024",
    tags: ["Brand", "Campaign"],
    subtitle: "Identité & activation",
  },
  "canal-plus": {
    year: "2025",
    tags: ["Content", "Broadcast"],
    subtitle: "Univers visuel",
  },
  castel: {
    year: "2024",
    tags: ["Brand", "Pack"],
    subtitle: "Campagne produit",
  },
  easytv: {
    year: "2025",
    tags: ["Digital", "UI"],
    subtitle: "Plateforme & contenu",
  },
  fanaf: {
    year: "2024",
    tags: ["Event", "Brand"],
    subtitle: "Identité événementielle",
  },
  "mutzig-class": {
    year: "2025",
    tags: ["Campaign", "Motion"],
    subtitle: "Film & social",
  },
  nkoyi: {
    year: "2024",
    tags: ["Brand", "Content"],
    subtitle: "Direction artistique",
  },
  "top-tropical": {
    year: "2025",
    tags: ["Pack", "Campaign"],
    subtitle: "Lancement produit",
  },
  "world-cola": {
    year: "2024",
    tags: ["Brand", "OOH"],
    subtitle: "Campagne nationale",
  },
};

function formatTitle(slug: string) {
  return (
    TITLE_MAP[slug] ??
    slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function getProjects(): Project[] {
  const root = path.join(process.cwd(), "public/projects");
  if (!fs.existsSync(root)) return [];

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = path.join(root, entry.name);
      const images = fs
        .readdirSync(dir)
        .filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((file) => `/projects/${entry.name}/${file}`);

      const meta = META_MAP[entry.name] ?? {
        year: "2025",
        tags: ["Création"],
        subtitle: "Projet studio",
      };

      return {
        slug: entry.name,
        title: formatTitle(entry.name),
        cover: images[0] ?? "",
        images,
        year: meta.year,
        tags: meta.tags,
        subtitle: meta.subtitle,
      };
    })
    .filter((project) => project.images.length > 0)
    .sort((a, b) => a.title.localeCompare(b.title, "fr"));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}
