import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const baseURL = process.env.TEST_URL || 'http://127.0.0.1:8000';
const output = new URL('../test-results/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.setDefaultTimeout(10000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const report = { checks: [], accessibility: [], viewport: [] };
const check = name => { report.checks.push(name); console.log('OK:', name); };
async function audit(label) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const result = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
  report.accessibility.push({ label, violations: result.violations, incomplete: result.incomplete.map(r => ({ id: r.id, targets: r.nodes.map(n => n.target) })) });
  assert.deepEqual(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [], `Axe: ${label}`);
}
async function assertNoOverflow() {
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
  assert.ok(dimensions.width <= dimensions.viewport, JSON.stringify(dimensions));
  return dimensions;
}
try {
  await page.goto(baseURL);
  await page.waitForSelector('#products article');
  assert.equal(await page.locator('#products article').count(), 8);
  const semantics = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
    const missingReferences = [...document.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]')].flatMap(e => ['aria-labelledby', 'aria-describedby', 'aria-controls'].flatMap(attr => (e.getAttribute(attr) || '').split(/\s+/).filter(id => id && !document.getElementById(id))));
    const badPatterns = [...document.querySelectorAll('[pattern]')].filter(e => { try { new RegExp(e.pattern, 'v'); return false; } catch { return true; } }).map(e => e.id);
    return { duplicates: ids.filter((id, i) => ids.indexOf(id) !== i), missingReferences, badPatterns, h1: document.querySelectorAll('h1').length };
  });
  assert.deepEqual(semantics, { duplicates: [], missingReferences: [], badPatterns: [], h1: 1 });
  check('Identificadores únicos, referencias ARIA válidas, un h1 y patrones HTML compilables');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Saltar al contenido');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'contenido');
  check('Enlace de salto accesible por teclado');

  await page.locator('#search').fill('grafica');
  await page.waitForFunction(() => document.querySelectorAll('#products article').length === 1);
  assert.match(await page.locator('#products h3').textContent(), /gráfica/);
  await page.locator('#search').fill('zzznothing');
  await page.locator('#empty-results').waitFor({ state: 'visible' });
  await page.locator('#clear-filters').click();
  await page.waitForFunction(() => document.querySelectorAll('#products article').length === 8);
  await page.locator('#category').selectOption('Camisetas');
  assert.equal(await page.locator('#products article').count(), 2);
  await page.locator('#sort').selectOption('price-desc');
  assert.match(await page.locator('#products h3').first().textContent(), /gráfica/);
  await page.locator('#clear-filters').click();
  await page.waitForFunction(() => document.querySelectorAll('#products article').length === 8);
  check('Búsqueda sin acentos, filtros, orden y resultados vacíos');

  const first = page.locator('#products article').first();
  await first.locator('select[id^="size-"]').selectOption('XL');
  assert.ok(await first.locator('button').isDisabled());
  await first.locator('select[id^="size-"]').selectOption('S');
  await first.locator('button').click();
  await first.locator('button').click();
  assert.equal(await page.locator('#cart-count').textContent(), '2');
  await page.locator('#open-cart').click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'close-cart');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'continue');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'close-cart');
  await page.getByRole('button', { name: /^Aumentar cantidad/ }).click();
  assert.match(await page.locator('#subtotal').textContent(), /59[.,]97/);
  await page.getByRole('button', { name: /^Reducir cantidad/ }).click();
  assert.match(await page.locator('#subtotal').textContent(), /39[.,]98/);
  await audit('Carrito con productos');
  await page.screenshot({ path: new URL('cart-desktop.png', output).pathname.replace(/^\/(\w:)/, '$1') });
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'open-cart');
  await page.reload();
  await page.waitForFunction(() => document.getElementById('cart-count').textContent === '2');
  await page.locator('#open-cart').click();
  await page.getByRole('button', { name: /^Eliminar:/ }).click();
  assert.ok(await page.locator('#cart-empty').isVisible());
  assert.equal(await page.evaluate(() => document.activeElement.id), 'close-cart');
  await page.keyboard.press('Escape');
  check('Carrito: variantes, stock, cantidades, subtotal, eliminación, persistencia y teclado del modal');

  await page.locator('#contact-form button').click();
  assert.equal(await page.locator('#contact-form [aria-invalid="true"]').count(), 4);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'name');
  await audit('Formulario con errores');
  await page.locator('#name').fill('María José');
  await page.locator('#email').fill('maria@example.com');
  await page.locator('#phone').fill('-------');
  await page.locator('#subject').fill('Consulta de tallas');
  await page.locator('#message').fill('Quiero conocer las tallas disponibles.');
  await page.locator('#contact-form button').click();
  assert.equal(await page.locator('#phone').getAttribute('aria-invalid'), 'true');
  await page.locator('#phone').fill('+593 99 123 4567');
  await page.locator('#contact-form button').click();
  assert.equal(await page.locator('#contact-form [aria-invalid="true"]').count(), 0);
  assert.match(await page.locator('#form-status').textContent(), /No se ha enviado/);
  assert.equal(new URL(page.url()).search, '');
  check('Formulario: errores vinculados, foco y validación sin transmitir datos');

  for (const width of [320, 375, 640, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(baseURL);
    await page.waitForSelector('#products article');
    // Scroll through lazy-loaded photos before checking them.
    for (const img of await page.locator('#products img').all()) await img.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    await page.evaluate(() => window.scrollTo(0, 0));
    report.viewport.push(await assertNoOverflow());
    if ([375, 1440].includes(width)) {
      await page.screenshot({ path: new URL(`page-${width}.png`, output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
      await audit(`Página a ${width}px`);
    }
    await page.locator('#open-cart').click();
    await assertNoOverflow();
    assert.ok(await page.evaluate(() => { const d = document.querySelector('dialog'); return d.scrollWidth <= d.clientWidth; }));
    await page.keyboard.press('Escape');
  }
  check('Cinco anchos entre 320 y 1440 px sin desbordamiento; fotografías cargadas');
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
  await assertNoOverflow();
  await page.locator('#products article').first().locator('button').click();
  await page.locator('#open-cart').click();
  assert.ok(await page.evaluate(() => { const d = document.querySelector('dialog'); return d.scrollWidth <= d.clientWidth; }));
  await audit('Espaciado personalizado a 320px y carrito abierto');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  check('Reflow a 320px, espaciado WCAG y movimiento reducido');

  await page.evaluate(() => localStorage.setItem('urban-style.cart.v1', '{broken'));
  await page.reload();
  await page.waitForSelector('#products article');
  assert.equal(await page.locator('#cart-count').textContent(), '0');
  await page.route('**/data/products.json', route => route.fulfill({ status: 503, body: '{}' }));
  await page.reload();
  await page.locator('#catalog-error').waitFor({ state: 'visible' });
  await page.unroute('**/data/products.json');
  await page.locator('#retry').click();
  await page.waitForSelector('#products article');
  assert.equal(await page.locator('#products article').count(), 8);
  check('Recuperación ante carrito corrupto y fallo de carga del catálogo');

  const privateContext = await browser.newContext();
  const privatePage = await privateContext.newPage();
  await privatePage.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); }; });
  await privatePage.goto(baseURL);
  await privatePage.locator('#products article').first().locator('button').click();
  assert.equal(await privatePage.locator('#cart-count').textContent(), '1');
  await privatePage.locator('#open-cart').click();
  assert.ok(await privatePage.locator('#storage-note').isVisible());
  await privateContext.close();
  check('Carrito usable con almacenamiento bloqueado');
  assert.deepEqual(errors, []);
  check('Sin errores JavaScript no controlados');
} finally {
  await writeFile(new URL('report.json', output), JSON.stringify(report, null, 2));
  await browser.close();
}
