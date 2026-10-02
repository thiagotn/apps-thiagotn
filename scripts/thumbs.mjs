#!/usr/bin/env node
/**
 * Gera as thumbnails da vitrine navegando nos apps de verdade.
 *
 * Playwright abre cada URL de src/data/apps.json, espera a página assentar e tira uma
 * captura da viewport; o ffmpeg recorta e converte para webp nas duas proporções que o
 * design usa: 16:10 nos cards e 4:3 no bloco de destaque.
 *
 * Roda sob demanda (`npm run thumbs`) e as imagens são commitadas — de propósito. Se isto
 * rodasse no build da imagem, o deploy passaria a depender de cinco sites externos estarem
 * no ar naquele minuto, e o CI baixaria um Chromium a cada build.
 *
 * Uso:
 *   npm run thumbs              # todos os apps
 *   npm run thumbs -- prumo     # só os slugs informados
 */
import { execFile } from 'node:child_process';
import { mkdir, readFile, rm, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'scripts', '.cache');
const OUT = join(ROOT, 'public', 'thumbs');

/** 1440×900 é 16:10 exato — a proporção dos cards sai sem recorte.
 *  2× porque a thumb aparece com ~560 px de largura em tela retina. */
const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2;

/** As duas saídas. O recorte do 4:3 tira das laterais e preserva o topo da página,
 *  que é onde mora a identidade de cada app. */
const FORMATS = [
  { suffix: '16x10', filter: 'scale=1120:700:flags=lanczos' },
  { suffix: '4x3', filter: 'crop=ih*4/3:ih:(iw-ih*4/3)/2:0,scale=1200:900:flags=lanczos' },
];

async function capture(page, app) {
  const shot = join(CACHE, `${app.slug}.png`);
  process.stdout.write(`  ${app.name} … `);

  try {
    await page.goto(app.url, { waitUntil: 'networkidle', timeout: 45_000 });
  } catch {
    // networkidle não chega em página com conexão aberta (websocket, polling, analytics).
    // O conteúdo já está lá; seguimos com o que carregou.
    process.stdout.write('(sem networkidle) ');
    await page.waitForLoadState('load').catch(() => {});
  }

  // rachao.app é SPA: o HTML inicial vem vazio e só a hidratação desenha a tela. Sem
  // esperar as fontes e dar um respiro, a captura sai em branco.
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(2_000);

  await page.screenshot({ path: shot });
  return shot;
}

async function convert(shot, slug) {
  for (const { suffix, filter } of FORMATS) {
    const out = join(OUT, `${slug}-${suffix}.webp`);
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', shot, '-vf', filter, '-c:v', 'libwebp', '-quality', '82', out]);
    const { size } = await stat(out);
    process.stdout.write(`${suffix} ${(size / 1024).toFixed(0)}KB  `);
  }
}

async function main() {
  const wanted = process.argv.slice(2);
  const { apps } = JSON.parse(await readFile(join(ROOT, 'src', 'data', 'apps.json'), 'utf8'));
  const targets = wanted.length ? apps.filter((a) => wanted.includes(a.slug)) : apps;

  if (targets.length === 0) {
    console.error(`Nenhum app casa com: ${wanted.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(CACHE, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    locale: 'pt-BR',
    // Sem isto a captura pode pegar o meio de uma animação de entrada.
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  console.log(`Gerando thumbnails de ${targets.length} app(s):`);
  for (const app of targets) {
    try {
      const shot = await capture(page, app);
      await convert(shot, app.slug);
      console.log('ok');
    } catch (error) {
      console.log(`FALHOU — ${error.message.split('\n')[0]}`);
      process.exitCode = 1;
    }
  }

  await browser.close();
  // As capturas intermediárias não servem para mais nada; só as webp são versionadas.
  await rm(CACHE, { recursive: true, force: true });
}

main();
