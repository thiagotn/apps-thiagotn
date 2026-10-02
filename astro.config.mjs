// @ts-check
import { defineConfig } from 'astro/config';

// Site estático puro: nenhuma rota precisa de servidor, e o resultado (dist/) é copiado
// para dentro de uma imagem nginx. O `site` alimenta canonical, sitemap e as URLs absolutas
// das meta tags Open Graph.
export default defineConfig({
  site: 'https://apps.thiagotn.com',
  output: 'static',
  build: {
    // Um arquivo por rota, em vez de /pagina/index.html: combina com o `try_files` do nginx
    // e evita redirect de trailing-slash atrás do Traefik.
    format: 'file',
  },
  devToolbar: { enabled: false },
});
