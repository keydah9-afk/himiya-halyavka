// Генератор data-файла для «картиночной» страницы книги.
//
// Берёт структуру розділів/§/тем из данных интерактивного ГДЗ и печатает
// готовый src/data/<book>-images.ts в формате ExerciseGallery: те же
// заголовки, тот же порядок, а вместо решений — список имён картинок
// (id задания = имя файла, label = подпись кнопки).
//
//   pnpm gen-images-data > ../halyavka-CLODE/src/data/grygorovych-himiya-8-images.ts
import { sections, meta } from '../src/data/grygorovych-himiya-8';

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

let count = 0;
const out: string[] = [];
out.push(`// Дані «картинкової» сторінки книги «Хімія, 8 клас» — Григорович (НУШ, «Ранок», 2025).
// Картинки-розв'язання генеруються з текстових відповідей режиму «Списати»:
//   pnpm render
// Сам цей файл теж генерується — руками не правити:
//   pnpm gen-images-data > ../halyavka-CLODE/src/data/grygorovych-himiya-8-images.ts
// Покроковий розбір кожного завдання живе на himiya.halyavka.net.

export const meta = ${JSON.stringify(meta, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'")};

export type ExItem = number | string | { file: string; label: string };
export interface Topic {
  title: string;
  numbers: ExItem[];
  collapsed?: boolean;
}
export interface Paragraph {
  title: string;
  topics: Topic[];
}
export interface Section {
  rozdil: string;
  paragraphs: Paragraph[];
}

export const sections: Section[] = [`);

for (const s of sections) {
  out.push(`  {`);
  out.push(`    rozdil: ${q(s.rozdil)},`);
  out.push(`    paragraphs: [`);
  for (const p of s.paragraphs) {
    const title = p.pages ? `${p.title} (${p.pages})` : p.title;
    out.push(`      { title: ${q(title)}, topics: [`);
    for (const t of p.topics) {
      const nums = t.items.map((i) => {
        count++;
        return /^\d+$/.test(i.label) && i.label === i.id ? q(i.label) : `{ file: ${q(i.id)}, label: ${q(i.label)} }`;
      });
      out.push(`        { title: ${q(t.title)},${t.collapsed ? ' collapsed: true,' : ''} numbers: [${nums.join(', ')}] },`);
    }
    out.push(`      ] },`);
  }
  out.push(`    ],`);
  out.push(`  },`);
}
out.push(`];`);
out.push(``);
out.push(`export const exercisesCount = ${count};`);
out.push(``);
console.log(out.join('\n'));
