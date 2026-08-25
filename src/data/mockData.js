export const MOCK_STUDENTS = [
  { id: 's1', firstName: 'Alice', lastName: 'Martin', email: 'alice@examhub.com', active: true },
  { id: 's2', firstName: 'Thomas', lastName: 'Dupont', email: 'thomas@examhub.com', active: true },
  { id: 's3', firstName: 'Sarah', lastName: 'Bernard', email: 'sarah@examhub.com', active: false },
  { id: 's4', firstName: 'Lucas', lastName: 'Petit', email: 'lucas@examhub.com', active: true },
  { id: 's5', firstName: 'Emma', lastName: 'Roux', email: 'emma@examhub.com', active: true },
];

export const MOCK_COURSES = [
  { id: 'c1', code: 'PROG2', name: 'Programmation Java', description: 'Langage Java et concepts orientés objet' },
  { id: 'c2', code: 'WEB2', name: 'Développement Web 2', description: 'React, routing et SPA' },
  { id: 'c3', code: 'BDD2', name: 'Bases de données 2', description: 'SQL avancé et modélisation' },
];

export const MOCK_EXAMS = [
  { id: 'e1', title: 'Examen final Java', courseId: 'c1', course: MOCK_COURSES[0], questionCount: 3, attemptCount: 8, totalPoints: 3, startDate: '2026-09-15T09:00:00Z', endDate: '2026-09-15T11:00:00Z', description: 'Évaluation complète de Java et POO' },
  { id: 'e2', title: 'Examen partiel Web', courseId: 'c2', course: MOCK_COURSES[1], questionCount: 2, attemptCount: 5, totalPoints: 2, startDate: '2026-08-20T14:00:00Z', endDate: '2026-08-20T16:00:00Z', description: 'React, hooks et routing' },
  { id: 'e3', title: 'Quiz bases SQL', courseId: 'c3', course: MOCK_COURSES[2], questionCount: 1, attemptCount: 3, totalPoints: 1, startDate: '2026-10-01T10:00:00Z', endDate: '2026-10-01T10:30:00Z', description: 'Requêtes SELECT et JOIN' },
  { id: 'e4', title: 'TP NOTÉ Spring Boot', courseId: 'c1', course: MOCK_COURSES[0], questionCount: 2, attemptCount: 0, totalPoints: 2, startDate: '2026-07-10T08:00:00Z', endDate: '2026-07-10T12:00:00Z', description: "Création d'une API REST" },
];

export const MOCK_EXAM = {
  id: 'e1', title: 'Examen final Java', courseId: 'c1',
  startDate: '2026-09-15T09:00:00Z', endDate: '2026-09-15T11:00:00Z',
  description: 'Évaluation complète de Java et POO',
};

export const MOCK_QUESTIONS = [
  {
    id: 'q1', text: "Quel langage est utilisé avec la JVM ?", points: 1,
    choices: [
      { id: 'ch1', text: 'Java', isCorrect: true },
      { id: 'ch2', text: 'Python', isCorrect: false },
      { id: 'ch3', text: 'HTML', isCorrect: false },
      { id: 'ch4', text: 'SQL', isCorrect: false },
    ],
  },
  {
    id: 'q2', text: "Quelle est la complexité moyenne de Arrays.sort() ?", points: 1,
    choices: [
      { id: 'ch5', text: 'O(n)', isCorrect: false },
      { id: 'ch6', text: 'O(n log n)', isCorrect: true },
      { id: 'ch7', text: 'O(n²)', isCorrect: false },
    ],
  },
  {
    id: 'q3', text: "Quel mot-clé hérite d'une classe en Java ?", points: 1,
    choices: [
      { id: 'ch8', text: 'extends', isCorrect: true },
      { id: 'ch9', text: 'implements', isCorrect: false },
      { id: 'ch10', text: 'import', isCorrect: false },
    ],
  },
];

export const MOCK_RESULTS = {
  average: 5.4,
  totalAttempts: 8,
  totalPoints: 3,
  results: [
    { studentId: 's1', firstName: 'Alice', lastName: 'Martin', score: 7, submittedAt: '2026-09-15T10:45:00Z' },
    { studentId: 's2', firstName: 'Thomas', lastName: 'Dupont', score: 5, submittedAt: '2026-09-15T10:50:00Z' },
    { studentId: 's3', firstName: 'Sarah', lastName: 'Bernard', score: 8, submittedAt: '2026-09-15T10:38:00Z' },
    { studentId: 's4', firstName: 'Lucas', lastName: 'Petit', score: 4, submittedAt: '2026-09-15T10:55:00Z' },
    { studentId: 's5', firstName: 'Emma', lastName: 'Roux', score: 6, submittedAt: '2026-09-15T10:42:00Z' },
    { studentId: 's6', firstName: 'Léa', lastName: 'Roux', score: 5, submittedAt: '2026-09-15T10:58:00Z' },
    { studentId: 's7', firstName: 'Nathan', lastName: 'Garnier', score: 3, submittedAt: '2026-09-15T10:30:00Z' },
    { studentId: 's8', firstName: 'Chloé', lastName: 'Lambert', score: 5, submittedAt: '2026-09-15T10:47:00Z' },
  ],
};
