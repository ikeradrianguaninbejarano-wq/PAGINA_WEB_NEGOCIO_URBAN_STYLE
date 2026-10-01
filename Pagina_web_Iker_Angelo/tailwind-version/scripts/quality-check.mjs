import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const issues = [];

function ensure(condition, message) {
  if (!condition) issues.push(message);
}

const ids = new Set([...html.matchAll(/\bid=['"]([^'"]+)['"]/g)].map(match => match[1]));
const hasMetaViewport = /<meta\s+[^>]*name=["']viewport["'][^>]*>/i.test(html);
const hasLang = /<html\s+[^>]*lang=["'][^"']+["'][^>]*>/i.test(html);
const h1Count = (html.match(/<h1\b/gi) || []).length;
const sections = ['header', 'nav', 'main', 'section', 'footer'];
for (const tag of sections) {
  ensure(new RegExp(`<${tag}\\b`, 'i').test(html), `Falta la etiqueta semántica <${tag}>.`);
}
ensure(hasMetaViewport, 'Falta la meta viewport para adaptabilidad responsiva.');
ensure(hasLang, 'Falta el atributo lang en <html>.');
ensure(h1Count === 1, `Debe existir exactamente un h1; se detectaron ${h1Count}.`);

const ariaRefs = [...html.matchAll(/(?:aria-labelledby|aria-describedby|aria-controls)=['"]([^'"]+)['"]/gi)]
  .flatMap(match => match[1].split(/\s+/).filter(Boolean));
for (const ref of ariaRefs) {
  ensure(ids.has(ref), `Referencia ARIA inexistente: ${ref}`);
}

const anchorMatches = [...html.matchAll(/<a\b([^>]*)>/gi)];
for (const [, attributes] of anchorMatches) {
  const hrefMatch = attributes.match(/href=['"]([^'"]+)['"]/i);
  if (!hrefMatch) continue;
  const href = hrefMatch[1];
  const targetBlank = /target\s*=\s*['"]_blank['"]/i.test(attributes);
  const rel = (attributes.match(/rel\s*=\s*['"]([^'"]+)['"]/i) || [null, ''])[1].toLowerCase();
  if (targetBlank && !rel.includes('noopener')) issues.push(`El enlace externo con target=_blank debe incluir rel="noopener". Enlace: ${href}`);
  if (targetBlank && !rel.includes('noreferrer')) issues.push(`El enlace externo con target=_blank debe incluir rel="noreferrer". Enlace: ${href}`);
  if (/youtube\.com|youtu\.be/i.test(href)) {
    ensure(/^https:\/\//i.test(href), `Los enlaces de YouTube deben usarse en HTTPS. Enlace no seguro: ${href}`);
    if (targetBlank && !rel.includes('noopener')) issues.push(`El enlace de YouTube con target=_blank debe incluir rel="noopener". Enlace: ${href}`);
    if (targetBlank && !rel.includes('noreferrer')) issues.push(`El enlace de YouTube con target=_blank debe incluir rel="noreferrer". Enlace: ${href}`);
  }
}

if (issues.length) {
  console.error('Errores de calidad detectados:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Calidad HTML y seguridad: OK');
