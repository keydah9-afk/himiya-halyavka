// Спільні типи для інтерактивних ГДЗ (SolutionGallery + ChemTrainer).
// Формат: розв'язання зберігаються структурованим текстом (не картинками),
// компонент рендерить їх у два режими — «Списати» (чиста відповідь для зошита)
// і «Зрозуміти» (покроковий розбір, віджети, самоперевірка).

export interface SolutionStep {
  label: string; // «Крок 1 · Формула», «Відповідь»; рендериться через set:html — можна <sub>, <sup>, <b>
  html: string; // зміст кроку (HTML, хімічні формули через <sub>)
  final?: boolean; // фінальний крок-відповідь (зелений блок)
}

export interface SolutionPart {
  label?: string; // підпункт «а) залізо, 7 г»; якщо частина одна — чіпи не показуються
  steps: SolutionStep[];
}

// Плитка елемента для віджета молярної маси: [символ, Ar, кількість атомів]
export type MolarPart = [string, number, number];

export interface MolarSubstance {
  key: string; // підпис на чіпі, напр. «а) H₂S» (unicode-індекси)
  html: string; // формула з <sub> для плиток і підсумку
  parts: MolarPart[];
}

export type SolutionWidget =
  | {
      type: 'molar';
      substances: MolarSubstance[];
      symbol?: string; // підпис величини у підсумку, HTML: 'M' (за замовч.) або 'M<sub>r</sub>'
      unit?: string; // одиниця після числа: 'г/моль' (за замовч.); '' — для безрозмірної Mr
    }
  // prompt і note, як і html, рендеряться через set:html — можна вживати <sub>, <sup>, <b>
  | { type: 'choice'; prompt: string; options: { html: string; correct?: boolean; note: string }[] };

export interface Solution {
  id: string; // ключ у hash та data-num: '42', 'pom-45'
  label: string; // напис на кнопці: '42', 'с. 45'
  caption?: string; // підпис у переглядачі; за замовч. «Вправа 42» для номерів, інакше сам label
  task: string; // умова (HTML)
  answer: string[]; // режим «Списати»: рядки відповіді, як у зошиті (unicode-індекси — копіюються текстом)
  intro?: string; // вступне пояснення в режимі «Зрозуміти»
  parts?: SolutionPart[]; // покроковий розбір (підпункти — окремі частини)
  widget?: SolutionWidget;
  checked?: boolean; // відповідь звірена з «Відповідями на розрахункові задачі» підручника
}

export interface SolutionTopic {
  title: string;
  items: Solution[];
  collapsed?: boolean;
}

export interface SolutionParagraph {
  title: string;
  pages?: string; // «стор. 45–53»
  topics: SolutionTopic[];
}

export interface SolutionSection {
  rozdil: string;
  paragraphs: SolutionParagraph[];
}

// Тренажер: генератор задач n = m/M та m = n·M зі свіжими числами.
export interface TrainerSubstance {
  name: string; // «води H₂O» (родовий відмінок, unicode-індекси)
  M: number; // молярна маса, г/моль
  mText: string; // як порахували M: «2·1 + 16 = 18»
}
