// @ts-check
import { defineConfig } from 'astro/config';

// Site estático puro: nenhuma rota precisa de servidor, e o resultado (dist/) é copiado
// para dentro de uma imagem nginx. O `site` alimenta canonical, sitemap e as URLs absolutas
// das meta tags Open Graph.
export default defineConfig({
  site: 'https://apps.thiagotn.com',
  output: 'static',
  build: {
    // Diretório por rota (/en/index.html): é o que faz /en/ funcionar com o `try_files` do
    // nginx, e é o mesmo formato de URL que o thiagotn.com usa para o idioma.
    format: 'directory',
  },
  devToolbar: { enabled: false },
});
