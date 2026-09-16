import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed via GitHub Pages under a custom domain, so the site lives at the root. Both
// values can be overridden at build time, e.g. for a project-site deployment without a
// custom domain:  SITE_URL=https://example.github.io SITE_BASE=/my-repo/ npm run build
const site = process.env.SITE_URL ?? 'https://tokendashboard.neuland-bfi.de';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  // Astro Fonts API, local provider: the files stay in the repo (OFL-licensed, licence files
  // alongside), Astro generates the @font-face rules, hashed URLs, preload links and
  // size-matched fallbacks. The CSS variables are consumed in src/styles/tokens.css.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/Inter-Variable.woff2'], weight: '300 800', style: 'normal', display: 'swap' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/JetBrainsMono-Variable.woff2'], weight: '400 600', style: 'normal', display: 'swap' },
        ],
      },
    },
  ],
});
