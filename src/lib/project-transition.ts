export type ProjectTransitionPayload = {
  slug: string;
  src: string;
  title: string;
  rect: { top: number; left: number; width: number; height: number };
};

const KEY = "ek-project-transition";

export function saveProjectTransition(payload: ProjectTransitionPayload) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function consumeProjectTransition(
  slug: string,
): ProjectTransitionPayload | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const data = JSON.parse(raw) as ProjectTransitionPayload;
    if (data.slug !== slug) return null;
    return data;
  } catch {
    return null;
  }
}
