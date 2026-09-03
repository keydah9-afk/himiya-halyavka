// Рендерер картинок-решений для «картиночной» страницы книги.
//
// Берёт массивы `answer[]` (режим «Списати») из данных интерактивного ГДЗ
// и рисует каждое задание в webp — так же, как для остальных книг сайта
// выглядят сканы. Текст в `answer` УЖЕ разбит на строки нужной ширины
// (максимум 72 символа), поэтому переносить слова не нужно: одна строка
// массива = одна строка картинки, пустая строка = половинный отступ.
//
// Рендер идёт через SVG → sharp, без браузера: быстро (сотни картинок
// за секунды) и без лишних зависимостей.
//
//   pnpm render --only=1,185 --png   — образцы в ./samples
//   pnpm render                       — все картинки в основной репозиторий
//
// Имя файла = id задания: 1.webp, pom-11.webp, nd2-dosl-1.webp.
//
// ВАЖНО: по умолчанию картинки пишутся в СОСЕДНИЙ репозиторий halyavka-CLODE —
// именно там живёт «картинковая» страница книги. Дописал новый § → перегенерируй
// картинки и список кнопок, иначе на halyavka.net его не будет.
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { sections } from '../src/data/grygorovych-himiya-8';
import type { Solution } from '../src/data/gdz-solutions';

const W = 760;
const PAD = 32;
const HEAD_BASE = 46; // baseline підпису «Вправа 185»
const RULE_Y = 68; // лінія під шапкою
const FIRST_BASE = 108; // baseline першого рядка відповіді
const STEP = 34; // крок між рядками
const GAP = 17; // порожній рядок — половинний крок
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const captionOf = (i: Solution) => i.caption ?? (/^\d+$/.test(i.label) ? `Вправа ${i.label}` : i.label);

function svgFor(it: Solution): { svg: string; h: number } {
  let y = FIRST_BASE;
  const rows: string[] = [];
  for (const line of it.answer) {
    if (line.trim() === '') {
      y += GAP;
      continue;
    }
    rows.push(`<text x="${PAD}" y="${y}" font-family="${FONT}" font-size="19" fill="#1f2328">${esc(line)}</text>`);
    y += STEP;
  }
  let bottom = y - STEP + 14;
  let mark = '';
  if (it.checked) {
    bottom += 20;
    mark = `<text x="${PAD}" y="${bottom}" font-family="${FONT}" font-size="13" fill="#6b7d88">✓ звірено з відповідями підручника</text>`;
    bottom += 6;
  }
  const h = Math.max(170, Math.round(bottom + PAD));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}">
<rect width="${W}" height="${h}" fill="#ffffff"/>
<text x="${PAD}" y="${HEAD_BASE}" font-family="${FONT}" font-size="22" font-weight="700" fill="#003049">${esc(captionOf(it))}</text>
<text x="${W - PAD}" y="${HEAD_BASE}" text-anchor="end" font-family="${FONT}" font-size="13" fill="#b9c2c8">halyavka.net</text>
<rect x="${PAD}" y="${RULE_Y}" width="${W - PAD * 2}" height="1" fill="#e3e7ea"/>
<rect x="${PAD}" y="${RULE_Y - 1}" width="58" height="3" fill="#C1121F"/>
${rows.join('\n')}
${mark}
</svg>`;
  return { svg, h };
}

async function main() {
  const args = process.argv.slice(2);
  const arg = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
  const outDir = resolve(arg('out') ?? '../halyavka-CLODE/public/images/8-klas/gdz-himiya-grygorovych');
  const only = arg('only')?.split(',').map((s) => s.trim());
  const alsoPng = args.includes('--png');

  const all: Solution[] = [];
  for (const s of sections) for (const p of s.paragraphs) for (const t of p.topics) all.push(...t.items);
  const list = only ? all.filter((i) => only.includes(i.id)) : all;

  mkdirSync(outDir, { recursive: true });
  let bytes = 0;
  let maxH = 0;
  for (const it of list) {
    const { svg, h } = svgFor(it);
    const buf = Buffer.from(svg);
    const info = await sharp(buf).webp({ quality: 92 }).toFile(`${outDir}/${it.id}.webp`);
    if (alsoPng) await sharp(buf).png().toFile(`${outDir}/${it.id}.png`);
    bytes += info.size;
    maxH = Math.max(maxH, h);
    if (only) console.log(`${it.id} — ${W}x${h}px, рядків ${it.answer.length}, ${(info.size / 1024).toFixed(1)} КБ`);
  }
  console.log(`\n${list.length} картинок → ${outDir}`);
  console.log(`сумарно ${(bytes / 1024 / 1024).toFixed(1)} МБ, у середньому ${(bytes / list.length / 1024).toFixed(1)} КБ, найвища ${maxH}px`);
}

main();
