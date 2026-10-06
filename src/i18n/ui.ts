// Os dois idiomas da página, no mesmo esquema do thiagotn.com: pt-BR na raiz e en-US
// sob /en/. Nada de biblioteca — são dois idiomas e uma página.

export const LOCALES = ['pt-BR', 'en-US'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt-BR';

/** O caminho onde cada idioma mora. O padrão fica na raiz, sem prefixo. */
export const PATHS: Record<Locale, string> = {
  'pt-BR': '/',
  'en-US': '/en/',
};

/** Como cada idioma se chama no seletor — sempre no próprio idioma. */
export const LOCALE_LABELS: Record<Locale, string> = {
  'pt-BR': 'PT',
  'en-US': 'EN',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  'pt-BR': 'Português',
  'en-US': 'English',
};

/** O outro idioma — com dois, "o outro" é suficiente e não precisa de lista. */
export const other = (locale: Locale): Locale => (locale === 'pt-BR' ? 'en-US' : 'pt-BR');

type Strings = {
  title: string;
  description: string;
  skipToContent: string;
  navBlog: string;
  switchTo: string;
  heroLine1: string;
  heroLine2: string;
  heroLede: string;
  filterLabel: string;
  filterAll: string;
  filterRegion: string;
  featuredBadge: string;
  appsRegion: string;
  open: string;
  openNamed: (name: string) => string;
  code: string;
  codeOf: (name: string) => string;
  viewOnGitHub: string;
  screenshotOf: (name: string) => string;
  empty: string;
  closingTitle: string;
  closingBody: string;
  closingBlog: string;
  closingGitHub: string;
  footer: string;
  notFoundLine1: string;
  notFoundLine2: string;
  notFoundBody: string;
  notFoundCta: string;
};

export const UI: Record<Locale, Strings> = {
  'pt-BR': {
    title: 'apps.thiagotn — provas de conceito com IA',
    description:
      'Provas de conceito que eu mantenho rodando no meu homelab para entender o que a IA muda no jeito de construir software: rachão, churrasco, gestão clínica, blog. Código aberto, infraestrutura própria.',
    skipToContent: 'Pular para o conteúdo',
    navBlog: 'Blog',
    switchTo: 'Ver em inglês',
    heroLine1: 'Da ideia ao deploy,',
    heroLine2: 'com IA no meio.',
    heroLede:
      'Provas de conceito que eu mantenho rodando no homelab para entender o que a IA muda no jeito de construir software. Código aberto, infraestrutura minha.',
    filterLabel: 'Filtrar por stack',
    filterAll: 'Todos',
    filterRegion: 'Filtrar por stack',
    featuredBadge: 'Em destaque',
    appsRegion: 'Apps',
    open: 'Abrir app',
    openNamed: (name) => `Abrir ${name}`,
    code: 'Código',
    codeOf: (name) => `Código de ${name} no GitHub`,
    viewOnGitHub: 'Ver no GitHub',
    screenshotOf: (name) => `Captura de tela de ${name}`,
    empty: 'Nenhum app com essa stack (ainda).',
    closingTitle: 'Tudo aberto, tudo no homelab.',
    closingBody:
      'Cada app roda em k3s em casa, com deploy por GitOps via Argo CD. Os bastidores eu conto no blog.',
    closingBlog: 'Ler o blog',
    closingGitHub: 'Ver o GitHub',
    footer: '© 2026 Thiago Nogueira · apps.thiagotn.com',
    notFoundLine1: 'Essa página',
    notFoundLine2: 'não existe.',
    notFoundBody: 'Talvez o link esteja velho. A lista completa de apps está na página inicial.',
    notFoundCta: 'Ver os apps',
  },
  'en-US': {
    title: 'apps.thiagotn — proofs of concept with AI',
    description:
      'Proofs of concept I keep running on my homelab to understand what AI changes about building software: pickup football, barbecue, clinic management, a blog. Open source, my own infrastructure.',
    skipToContent: 'Skip to content',
    navBlog: 'Blog',
    switchTo: 'View in Portuguese',
    heroLine1: 'From idea to deploy,',
    heroLine2: 'with AI in between.',
    heroLede:
      'Proofs of concept I keep running on my homelab to understand what AI changes about building software. Open source, my own infrastructure.',
    filterLabel: 'Filter by stack',
    filterAll: 'All',
    filterRegion: 'Filter by stack',
    featuredBadge: 'Featured',
    appsRegion: 'Apps',
    open: 'Open app',
    openNamed: (name) => `Open ${name}`,
    code: 'Code',
    codeOf: (name) => `${name} source on GitHub`,
    viewOnGitHub: 'View on GitHub',
    screenshotOf: (name) => `Screenshot of ${name}`,
    empty: 'No apps with that stack (yet).',
    closingTitle: 'All open, all self-hosted.',
    closingBody:
      'Every app runs on k3s at home, deployed by GitOps with Argo CD. I write about the backstage on the blog.',
    closingBlog: 'Read the blog',
    closingGitHub: 'Browse GitHub',
    footer: '© 2026 Thiago Nogueira · apps.thiagotn.com',
    notFoundLine1: 'This page',
    notFoundLine2: 'does not exist.',
    notFoundBody: 'The link may be old. The full list of apps is on the home page.',
    notFoundCta: 'See the apps',
  },
};
