// Tudo o que a página mostra é derivado de src/data/apps.json em tempo de build.
// Nada de contagem escrita à mão: acrescentar um app ao JSON basta para o filtro,
// os números dos chips e os tints dos cards acompanharem.
import data from '../data/apps.json';

export type App = {
  slug: string;
  name: string;
  kind: string;
  url: string;
  repo: string;
  summary: string;
  stacks: string[];
  featured?: boolean;
};

export const APPS: App[] = data.apps;

/** O rótulo do chip que significa "sem filtro". Vale como valor de `data-filter`. */
export const ALL = 'Todos';

/**
 * Os tints de fundo dos cards, na ordem em que se repetem.
 *
 * O fundo só aparece enquanto a thumbnail não carrega (ou se ela faltar): é o fallback
 * que o design pede, e é por isso que ele cicla — dois cards vizinhos nunca repetem a cor.
 */
const TINTS = [
  'var(--color-accent-100)',
  'var(--color-accent-2-100)',
  'var(--color-accent-200)',
  'var(--color-accent-2-200)',
];

/** O app em destaque. Explícito no JSON; sem marcação, o primeiro da lista. */
export const FEATURED: App = APPS.find((a) => a.featured) ?? APPS[0]!;

/** Quantos apps usam cada stack. Um app conta uma vez por stack. */
export function stackCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const app of APPS) {
    for (const stack of app.stacks) counts.set(stack, (counts.get(stack) ?? 0) + 1);
  }
  return counts;
}

export type Chip = { name: string; count: number; isAll: boolean };

/**
 * Os chips do filtro: "Todos" primeiro, depois por número de apps (maior antes) e,
 * no empate, em ordem alfabética.
 *
 * `localeCompare` e não `<`: a comparação por code point mandaria "k3s" para depois de
 * "Next.js" (minúscula vem depois de maiúscula na tabela), e a ordem visível mudaria.
 */
export function chips(): Chip[] {
  const counts = stackCounts();
  const names = [...counts.keys()].sort(
    (a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b),
  );
  return [
    { name: ALL, count: APPS.length, isAll: true },
    ...names.map((name) => ({ name, count: counts.get(name)!, isAll: false })),
  ];
}

/**
 * Os cards do grid, na ordem do JSON e já com o tint resolvido.
 *
 * O destaque entra na lista mesmo estando no bloco de cima: sob o filtro "Todos" o CSS o
 * esconde daqui, e sob qualquer outro filtro ele reaparece — sem repetir markup.
 * Os tints seguem a disposição do estado padrão (destaque fora do grid), que é a vista
 * que praticamente todo mundo vê primeiro.
 */
export function cards(): Array<App & { tint: string }> {
  return APPS.map((app, i) => ({ ...app, tint: TINTS[i % TINTS.length]! }));
}

/** Os stacks dentro do atributo de um card, delimitados para casar exato no CSS.
 *
 * Delimitado por "|" e não separado por espaço porque há stacks com espaço no nome
 * ("Argo CD"): com espaço, o seletor `~=` quebraria o nome em duas palavras.
 */
export function stacksAttr(stacks: string[]): string {
  return `|${stacks.join('|')}|`;
}
