# apps.thiagotn.com

Vitrine dos side projects: uma página só, com thumbnail, resumo, stacks e links de cada app,
filtrável por stack. Astro gerando HTML estático, servido por nginx num container no homelab.

## Rodar

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/
npm run preview
```

## Acrescentar um app

Só `src/data/apps.json`. Os chips do filtro, as contagens, a ordem e os tints dos cards são
derivados dali em tempo de build — não há lista repetida em lugar nenhum.

```json
{
  "slug": "meuapp",
  "name": "meuapp.com",
  "kind": "Web app",
  "url": "https://meuapp.com",
  "repo": "https://github.com/thiagotn/meuapp",
  "summary": "Uma frase sobre o que ele faz.",
  "stacks": ["Go", "PostgreSQL"]
}
```

`"featured": true` marca o app do bloco de destaque — um só. Depois, `npm run thumbs meuapp`.

## Thumbnails

```bash
npm run thumbs            # todos os apps
npm run thumbs prumo      # só um
```

`scripts/thumbs.mjs` abre cada app com Playwright, espera a página assentar e tira uma captura;
o ffmpeg converte para webp em 16:10 (cards) e 4:3 (destaque). As imagens são **commitadas**,
e é de propósito: se isso rodasse no build da imagem, o deploy passaria a depender de cinco
sites externos estarem no ar naquele minuto, e dois builds do mesmo commit produziriam sites
diferentes — o oposto do que GitOps assume.

**Olhe as imagens antes de commitar.** Elas são capturas de apps reais: vale conferir que não
entrou banner de cookie, tela de carregamento ou dado de alguém.

Enquanto um arquivo não existir, o card continua certo: aparece o retângulo colorido que o
design já especifica como fallback.

## Como o filtro funciona

Sem framework e quase sem JavaScript. Em build time, `src/lib/apps.ts` gera três regras CSS por
stack (esconder o que não casa, acender o chip, destacar a tag correspondente). Em runtime, o
único trabalho do script é trocar `data-filter` no `<html>` e espelhar o estado em `?stack=`.

O bloco de destaque aparece só com o filtro em "Todos"; nesse estado o card do mesmo app fica
escondido no grid, e volta a aparecer sob qualquer outro filtro — como no protótipo.

## Deploy

`git push` na `main`. O workflow publica `ghcr.io/thiagotn/apps-thiagotn:sha-<sha>` e escreve essa
tag em `helm/apps/apps-thiagotn/kustomization.yaml` no repo `thiagotn/homelab`; o Argo CD percebe
o commit e faz o rollout. Mesmo fluxo do `thiagotn-blog`.

Rollback é no git do homelab: apontar `newTag` para um sha anterior. `kubectl set image` não
adianta — o `selfHeal` do Argo reverte.

## Design

O visual veio de um handoff de alta fidelidade (design system "Organic"). `src/styles/organic.css`
é cópia fiel dele, com uma única mudança: o `@import` de Google Fonts saiu e as fontes entram por
`<link>` no layout, porque `@import` serializa o download.

Duas coisas que parecem decorativas e não são: o `overflow-x: clip` no body (sem ele o círculo
de fundo cria rolagem horizontal) e o `margin-left: -0.028em` no H1 (compensação ótica da
Caprasimo).
