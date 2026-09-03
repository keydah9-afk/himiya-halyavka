// Реєстр книг піддомена. Головна сторінка будується з нього ж,
// тому нову книгу достатньо додати сюди й покласти сторінку в pages/<klas>-klas/<slug>/.
export interface BookEntry {
  klas: number;
  slug: string; // адреса: /<klas>-klas/<slug>/
  author: string; // коротко, для картки: «Григорович»
  authorFull: string;
  publisher: string;
  year: number;
  cover: string; // шлях у public
  count?: number; // скільки завдань уже розібрано
  progress?: string; // що саме готове: «§ 1 – § 20, вправи 1–260»
  note?: string; // підпис на картці «скоро»
  ready: boolean; // false — картка сіра, посилання немає
  // Дзеркальна сторінка з готовими відповідями-картинками на основному сайті.
  mirror?: string;
}

export const books: BookEntry[] = [
  {
    klas: 8,
    slug: 'grygorovych',
    author: 'Григорович',
    authorFull: 'Олексій Григорович, Олександр Недоруб',
    publisher: 'Ранок',
    year: 2025,
    cover: '/covers/8-himiya-grygorovych-2025.webp',
    count: 403,
    progress: '§ 1 – § 20 (вправи 1–260) і 8 навчальних досліджень',
    ready: true,
    mirror: 'https://halyavka.net/8-klas/gdz-himiya-grygorovych/',
  },
  {
    klas: 8,
    slug: 'popel',
    author: 'Попель, Крикля',
    authorFull: 'Павло Попель, Людмила Крикля',
    publisher: 'Академія',
    year: 2025,
    cover: '',
    ready: false,
    note: 'у роботі',
  },
  {
    klas: 9,
    slug: 'grygorovych-9',
    author: 'Григорович',
    authorFull: 'Олексій Григорович',
    publisher: 'Ранок',
    year: 2025,
    cover: '',
    ready: false,
    note: 'у планах',
  },
];
