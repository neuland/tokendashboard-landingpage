export type RepoKind = 'frontend' | 'backend' | 'plugin';
export type ProviderId = 'claude' | 'copilot' | 'opencode';

export interface Repo {
  id: string;
  kind: RepoKind;
  name: string;
  title: string;
  provider?: ProviderId;
  tagline: string;
  description: string;
  stack: string[];
  url: string;
  readme: string;
  decisions?: string;
  install?: string;
  captures?: string;
  runsIn?: string;
}

const GH = 'https://github.com/neuland';

export const REPOS: Repo[] = [
  {
    id: 'frontend',
    kind: 'frontend',
    name: 'tokendashboard-frontend',
    title: 'Frontend',
    tagline: 'The dashboard people open in the browser.',
    description:
      'Static Astro site with React islands: company-wide KPIs, provider comparison, history charts and one page per provider, broken down by model and token type. German and English.',
    stack: ['Astro 7', 'React 18', 'Recharts', 'TypeScript', 'nginx'],
    url: `${GH}/tokendashboard-frontend`,
    readme: `${GH}/tokendashboard-frontend#readme`,
  },
  {
    id: 'backend',
    kind: 'backend',
    name: 'tokendashboard-backend',
    title: 'Backend',
    tagline: 'Receives usage, prices it, estimates CO₂, aggregates.',
    description:
      'Kotlin/Ktor service with Postgres. Plugins push raw token counts; the backend deduplicates, applies prices and CO₂ factors and serves aggregates and time series. It never polls a provider.',
    stack: ['Kotlin', 'Ktor', 'PostgreSQL', 'Gradle', 'Kotest'],
    url: `${GH}/tokendashboard-backend`,
    readme: `${GH}/tokendashboard-backend#readme`,
    decisions: `${GH}/tokendashboard-backend/blob/main/docs/decisions.md`,
  },
  {
    id: 'plugin-claude',
    kind: 'plugin',
    provider: 'claude',
    name: 'tokendashboard-plugin-claude',
    title: 'Claude Code plugin',
    tagline: 'Hooks into Claude Code, reads the transcript, reports per turn.',
    description:
      'Registers hooks in Claude Code, reads the transcript after every turn and queues one entry per model — subagents included. Ships a statusline with session tokens, sync state and price.',
    stack: ['Node ≥ 18', 'zero dependencies', 'Claude Code hooks'],
    url: `${GH}/tokendashboard-plugin-claude`,
    readme: `${GH}/tokendashboard-plugin-claude#readme`,
    decisions: `${GH}/tokendashboard-plugin-claude/tree/main/docs/decisions`,
    install: `npx git+https://github.com/neuland/tokendashboard-plugin-claude.git install \\
  --api-base-url https://tokendashboard.example.com \\
  --repo-raw-base-url https://raw.githubusercontent.com/neuland/tokendashboard-plugin-claude/main`,
    captures: 'per turn and per subagent, per model',
    runsIn: '~/.claude/tokendashboard-plugin/',
  },
  {
    id: 'plugin-copilot',
    kind: 'plugin',
    provider: 'copilot',
    name: 'tokendashboard-plugin-copilot',
    title: 'GitHub Copilot CLI plugin',
    tagline: 'Waits for Copilot’s session.shutdown event, reports per session.',
    description:
      'Copilot CLI only exposes totals in its session.shutdown event, so the plugin captures per session in a detached process that outlives Copilot, and sweeps for missed sessions on the next start.',
    stack: ['Node ≥ 18', 'zero dependencies', 'Copilot CLI hooks'],
    url: `${GH}/tokendashboard-plugin-copilot`,
    readme: `${GH}/tokendashboard-plugin-copilot#readme`,
    decisions: `${GH}/tokendashboard-plugin-copilot/tree/main/docs/decisions`,
    install: `npx git+https://github.com/neuland/tokendashboard-plugin-copilot.git install \\
  --api-base-url https://tokendashboard.example.com \\
  --repo-raw-base-url https://raw.githubusercontent.com/neuland/tokendashboard-plugin-copilot/main`,
    captures: 'per session, per model',
    runsIn: '~/.copilot/tokendashboard-plugin/',
  },
  {
    id: 'plugin-opencode',
    kind: 'plugin',
    provider: 'opencode',
    name: 'tokendashboard-plugin-opencode',
    title: 'OpenCode plugin',
    tagline: 'Loaded in-process by OpenCode, reports per assistant message.',
    description:
      'A single dependency-free file loaded in-process by OpenCode. Subscribes to message.updated and session.idle and queues one entry per finalized assistant message.',
    stack: ['Node ≥ 18 / Bun', 'zero dependencies', 'OpenCode plugin API'],
    url: `${GH}/tokendashboard-plugin-opencode`,
    readme: `${GH}/tokendashboard-plugin-opencode#readme`,
    decisions: `${GH}/tokendashboard-plugin-opencode/tree/main/docs/decisions`,
    install: `npx --allow-git=all git+https://github.com/neuland/tokendashboard-plugin-opencode.git install \\
  --api-base-url https://tokendashboard.example.com \\
  --repo-raw-base-url https://raw.githubusercontent.com/neuland/tokendashboard-plugin-opencode/main`,
    captures: 'per assistant message, per model',
    runsIn: '~/.config/opencode/plugin/',
  },
];

export const PLUGINS = REPOS.filter((r) => r.kind === 'plugin');

export const PROVIDER_LABEL: Record<ProviderId, string> = {
  claude: 'Claude',
  copilot: 'Copilot',
  opencode: 'OpenCode',
};
