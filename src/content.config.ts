import { readFile } from 'node:fs/promises';
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import type { Loader } from 'astro/loaders';
import { classify, DECISIONS_DEFAULT_SOURCE, DECISIONS_LOG_URL, DECISIONS_REPO } from './lib/decisions';

// The decisions section is generated from the backend repository's decision log
// (docs/decisions.md on main), read at build time. Nothing is duplicated here: a decision
// shows up on the site once it is in that log. See src/lib/decisions.ts for the source URL
// and the DECISIONS_SOURCE override.

interface ParsedDecision {
  number: number;
  title: string;
  body: string;
}

/** Splits the log at its `## N. Title` headings. A heading wrapped onto an indented second line is joined. */
function parseLog(markdown: string): ParsedDecision[] {
  const lines = markdown.split(/\r?\n/);
  const decisions: ParsedDecision[] = [];
  let current: ParsedDecision | null = null;
  let headingJustSeen = false;
  for (const line of lines) {
    const heading = line.match(/^## (\d+)\.\s+(.*)$/);
    if (heading) {
      current = { number: Number(heading[1]), title: heading[2].trim().replace(/`/g, ''), body: '' };
      decisions.push(current);
      headingJustSeen = true;
      continue;
    }
    if (!current) {
      continue;
    }
    if (headingJustSeen && /^\s+\S/.test(line)) {
      current.title += ` ${line.trim().replace(/`/g, '')}`;
      continue;
    }
    headingJustSeen = false;
    current.body += `${line}\n`;
  }
  return decisions.map((d) => ({ ...d, body: d.body.trim() }));
}

/** GitHub's heading anchor: lowercase, punctuation removed, spaces to hyphens. */
function githubAnchor(number: number, title: string): string {
  return `${number}-${title}`
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

function slugify(number: number, title: string): string {
  const words = title
    .toLowerCase()
    .replace(/co₂/g, 'co2')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 7)
    .join('-');
  return `${number}-${words}`;
}

/** First paragraph, markdown markers stripped, cut at a word boundary. */
function summarize(body: string, max = 200): string {
  const firstParagraph = body.split(/\n\s*\n/)[0] ?? '';
  const plain = firstParagraph
    .replace(/\s+/g, ' ')
    .replace(/[`*]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim()
    .replace(/[:—-]\s*$/, '');
  if (plain.length <= max) {
    return plain;
  }
  return `${plain.slice(0, max).replace(/\s+\S*$/, '')} …`;
}

/** The log lives in docs/, so relative links resolve from there; bare "README.md" mentions become links. */
function absolutizeLinks(body: string): string {
  return body
    .replace(/\]\((?!https?:\/\/|#|mailto:)([^)]+)\)/g, (_m, path: string) => {
      const target = path.startsWith('../') ? path.slice(3) : `docs/${path}`;
      return `](${DECISIONS_REPO}/blob/main/${target})`;
    })
    .replace(/(?<![\[(\/\w])README\.md/g, `[README.md](${DECISIONS_REPO}#readme)`);
}

async function readSource(source: string): Promise<string> {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`Could not load the decision log from ${source}: HTTP ${res.status}`);
    }
    return res.text();
  }
  return readFile(source, 'utf8');
}

const backendDecisionsLoader: Loader = {
  name: 'backend-decisions',
  async load({ store, logger, parseData, renderMarkdown }) {
    const source = process.env.DECISIONS_SOURCE ?? DECISIONS_DEFAULT_SOURCE;
    logger.info(`Loading the decision log from ${source}`);
    const decisions = parseLog(await readSource(source));
    if (decisions.length === 0) {
      throw new Error(`No decisions found in ${source} — expected "## N. Title" headings`);
    }
    store.clear();
    for (const d of decisions) {
      const id = slugify(d.number, d.title);
      const data = await parseData({
        id,
        data: {
          number: d.number,
          title: d.title,
          summary: summarize(d.body),
          area: classify(d.number, d.title),
          sourceUrl: `${DECISIONS_LOG_URL}#${githubAnchor(d.number, d.title)}`,
        },
      });
      const body = absolutizeLinks(d.body);
      store.set({ id, data, body, rendered: await renderMarkdown(body) });
    }
    logger.info(`Loaded ${decisions.length} decisions`);
  },
};

const decisions = defineCollection({
  loader: backendDecisionsLoader,
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    summary: z.string(),
    area: z.enum(['calculation', 'privacy', 'architecture']),
    sourceUrl: z.string().url(),
  }),
});

export const collections = { decisions };
