import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const serverDir = path.resolve(distDir, 'server');

async function prerender() {
  console.log('🚀 Starting prerendering...');

  // Charger le module server build
  const serverEntry = path.resolve(serverDir, 'entry-server.js');

  if (!fs.existsSync(serverEntry)) {
    console.error('❌ Server entry not found:', serverEntry);
    process.exit(1);
  }

  const { render } = await import(serverEntry);

  // Lire le template HTML
  const templatePath = path.resolve(distDir, 'index.html');
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Rendre l'application
  console.log('📝 Rendering React app...');
  const appHtml = render();

  // Injecter le HTML rendu dans le template
  // Remplace <div id="root"></div> par <div id="root">...contenu...</div>
  template = template.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${appHtml}</div>`
  );

  // Écrire le fichier final
  fs.writeFileSync(templatePath, template);
  console.log('✅ Prerendering complete! Output:', templatePath);

  // Afficher un aperçu du contenu généré
  const contentPreview = appHtml.substring(0, 500);
  console.log('\n📄 Content preview:');
  console.log(contentPreview + '...\n');
}

prerender().catch((err) => {
  console.error('❌ Prerendering failed:', err);
  process.exit(1);
});
