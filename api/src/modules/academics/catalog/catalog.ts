import { Subject, SubjectCode } from '../subjects.entity';

export const ACADEMIC_CATALOG: { subjects: Subject[] } = {
  subjects: [
    {
      id: 'euskara',
      name: 'Euskara',
      categories: [
        { code: 'ulermena', label: 'Ulermena' },
        { code: 'idazmena', label: 'Idazmena' },
        { code: 'gramatika', label: 'Gramatika' },
        { code: 'lexikoa', label: 'Lexikoa' },
      ],
    },
    {
      id: 'gaztelera',
      name: 'Gaztelera',
      categories: [
        { code: 'ulermena', label: 'Ulermena' },
        { code: 'idazmena', label: 'Idazmena' },
        { code: 'gramatika', label: 'Gramatika' },
        { code: 'lexikoa', label: 'Lexikoa' },
      ],
    },
    {
      id: 'inguru',
      name: 'Inguru',
      categories: [
        { code: 'ulermena', label: 'Ulermena' },
        { code: 'idazmena', label: 'Idazmena' },
        { code: 'lexikoa', label: 'Lexikoa' },
      ],
    },
    {
      id: 'matematika',
      name: 'Matematika',
      categories: [
        { code: 'kalkulu_mentala', label: 'Kalkulu Mentala' },
        { code: 'aritmetika', label: 'Aritmetika' },
        { code: 'buruketak', label: 'Buruketak' },
      ],
    },
    {
      id: 'ingelesa',
      name: 'Ingelesa',
      categories: [
        { code: 'reading', label: 'Reading' },
        { code: 'writing', label: 'Writing' },
        { code: 'grammar', label: 'Grammar' },
        { code: 'vocabulary', label: 'Vocabulary' },
      ],
    },
  ],
} as { subjects: Subject[] };
