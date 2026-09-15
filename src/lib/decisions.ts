export type Area = 'calculation' | 'privacy' | 'architecture';

export const AREAS: { id: Area; label: string; lede: string }[] = [
  { id: 'calculation', label: 'Calculation', lede: 'How the numbers in the dashboard come about.' },
  { id: 'privacy', label: 'Privacy', lede: 'What is stored, and what can never be derived from it.' },
  { id: 'architecture', label: 'Architecture', lede: 'How plugins, backend and frontend work together — and which tools are covered.' },
];

export const AREA_LABEL: Record<Area, string> = Object.fromEntries(AREAS.map((a) => [a.id, a.label])) as Record<Area, string>;

/**
 * Where the decisions come from: the backend repository's decision log, read at build time.
 * `DECISIONS_SOURCE` may point at another URL or at a local file (for previewing an
 * uncommitted log): DECISIONS_SOURCE=../tokendashboard-backend/docs/decisions.md npm run dev
 */
export const DECISIONS_REPO = 'https://github.com/neuland/tokendashboard-backend';
export const DECISIONS_LOG_URL = `${DECISIONS_REPO}/blob/main/docs/decisions.md`;
export const DECISIONS_DEFAULT_SOURCE = 'https://raw.githubusercontent.com/neuland/tokendashboard-backend/main/docs/decisions.md';

/**
 * Classifies a decision into an area. Explicit assignments by number first (the log is an
 * append-only list, so numbers are stable); keywords in the title for everything newer.
 */
const AREA_BY_NUMBER: Record<number, Area> = {
  1: 'architecture', 2: 'calculation', 3: 'calculation', 4: 'privacy', 5: 'architecture',
  6: 'privacy', 7: 'architecture', 8: 'calculation', 9: 'calculation', 10: 'calculation',
  11: 'calculation', 12: 'calculation', 13: 'calculation', 14: 'architecture',
};

export function classify(number: number, title: string): Area {
  const fixed = AREA_BY_NUMBER[number];
  if (fixed) {
    return fixed;
  }
  const t = title.toLowerCase();
  if (/\b(auth|user|users|installation|attribution|anonym|pseudonym|privacy|personal)\b/.test(t)) return 'privacy';
  if (/\b(cost|price|prices|co₂|co2|token|tokens|round|precision|factor|estimate|cache)\b/.test(t)) return 'calculation';
  // Everything else — including what is or is not measured — is architecture.
  return 'architecture';
}
