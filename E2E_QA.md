# Exam-Hub Frontend — Q&R (d'après le code sur `main`)

## 1. React, Vite, TailwindCSS, React Router et Sonner

**Q : Quelles sont les dépendances principales et leurs rôles ?**

R : Le projet utilise **React 19** comme bibliothèque UI, **Vite 8** comme build tool/dev server, **TailwindCSS 4** pour le styling, **React Router 7** pour le routage côté client, **Lucide React** pour les icônes et **Sonner** pour les notifications toast. ESLint sert à l'analyse statique du code. Le fichier `package.json` confirme ces dépendances.

---

## 2. Architecture globale du projet

**Q : Comment est organisée l'architecture du projet ?**

R : L'architecture suit une structure modulaire :
- `src/pages/` — Composants de pages (SplashScreen, Login, pages admin/student, pages d'erreur)
- `src/components/` — Composants réutilisables (`common/` : Button, Input, Modal, Badge, etc. ; `admin/` : ExamForm, QuestionForm ; `student/` : skelettes)
- `src/layouts/` — Layouts AdminLayout et StudentLayout avec sidebar responsive
- `src/context/` — AuthContext pour la gestion d'état auth
- `src/hooks/` — UseAuth hook personnalisé
- `src/api/` — Services API (api.js, authService, studentService, courseService, examService, questionService, resultService, myExamService, myResultService)
- `src/routes/` — ProtectedRoute et RoleRoute pour la protection des routes
- `src/utils/` — Helpers (auth.js, formatters.js)

---

## 3. Routage et protection des routes

**Q : Comment fonctionne le système de routage et de protection ?**

R : Le fichier `App.jsx` définit toutes les routes via `react-router-dom` :
- `/` → SplashScreenPage (redirige vers `/login` après 3s)
- `/login` → LoginPage
- `/admin/*` → Protégé par `ProtectedRoute` + `RoleRoute` (rôle `admin`) avec `AdminLayout`
- `/student/*` → Protégé par `ProtectedRoute` + `RoleRoute` (rôle `student`) avec `StudentLayout`
- `*` → NotFoundPage (404)

`ProtectedRoute` redirige vers `/login` si l'utilisateur n'est pas authentifié. `RoleRoute` vérifie que l'utilisateur a le rôle requis (`admin` ou `student`). Le `Outlet` permet le rendu des pages imbriquées dans les layouts.

---

## 4. Authentification et gestion de session

**Q : Comment l'authentification est-elle gérée ?**

R : Le flux d'authentification fonctionne ainsi :
1. `AuthContext.jsx` fournit l'état `user`, les fonctions `login` et `logout`
2. `login(email, password)` appelle `authService.login()` → `POST /auth/login`
3. Le token est stocké dans `localStorage` sous la clé `'token'`
4. L'objet utilisateur (id, email, role, firstName, lastName) est stocké sous `'user'`
5. Un `storage` event listener permet de synchroniser l'état entre onglets
6. `logout()` supprime les items du localStorage et remet `user` à `null`
7. Le `LoginPage` redirige vers `/admin` si admin, `/student/exams` si student après connexion

---

## 5. API et services

**Q : Comment les appels API sont-ils structurés ?**

R : `api.js` est le service central :
- `BASE_URL` vient de `import.meta.env.VITE_API_URL` ou `/api` par défaut
- `request()` effectue les fetch avec les headers `Content-Type: application/json` et `Authorization: Bearer <token>`
- Gestion des erreurs via `ApiError` (avec `status`)
- `api.get/post/put/patch/delete` comme raccourcis

Services dérivés :
- `authService` → `POST /auth/login`
- `studentService` → CRUD students (`/students`, `/students/:id/activate`, `/students/:id/deactivate`)
- `courseService` → CRUD cours
- `examService` → CRUD examens, `getExams(courseId?)`
- `questionService` → CRUD questions par examen
- `resultService` → `getExamResults(examId)`
- `myExamService` → `getExams(status)`, `getExamDetail(id)`, `submitExam(id, answers)`, `getExamResult(id)`
- `myResultService` → `getResults()`

---

## 6. Pages et fonctionnalités Admin

**Q : Quelles sont les pages admin et leurs fonctionnalités ?**

R : Les routes admin (`/admin/*`) :
- **AdminDashboardPage** — Tableau de bord avec stats (utilisateurs, cours, examens) et actions rapides
- **StudentsPage** — CRUD utilisateurs complet (créer, modifier, désactiver/réactiver), recherche, filtrage par statut, vue mobile (cards) + desktop (table)
- **CoursesPage** — CRUD cours, comptage des examens par cours
- **ExamsPage** — CRUD examens avec filtre par cours, recherche, gestion du statut (À venir/Ouvert/Terminé)
- **QuestionsPage** — Gestion des questions d'un examen avec verrouillage si tentatives existent
- **ExamResultsPage** — Statistiques des résultats (moyenne, tentatives, étudiants)
- **UnderConstructionPage** — Page en construction avec SVG animé

---

## 7. Pages et fonctionnalités Étudiant

**Q : Quelles sont les pages étudiant et leurs fonctionnalités ?**

R : Les routes student (`/student/*`) :
- **StudentDashboardPage** — Page d'accueil avec stats (examens disponibles, terminés, résultats)
- **ExamStudentPage** — Liste des examens avec onglets "Ouverts" et "À venir"
- **TakeExamPage** — Passage de l'examen : affichage des questions, sélection des réponses, progression (answeredCount/totalQuestions), modal de confirmation avant soumission
- **StudentResultsPage** — Historique des résultats avec couleur selon validation (≥50% = vert, <50% = rouge)
- **ExamResultPage** — Détail de la correction : note finale, résumé, correction détaillée question par question (réponse étudiant vs bonne réponse)

---

## 8. Composants communs

**Q : Quels sont les composants communs réutilisables ?**

R :
- **Button** — 4 variantes : `primary`, `violet`, `danger`, `ghost` avec état loading
- **Input** — Champs texte/email/password/number/date avec label, icône et validation
- **Textarea** — Zone de texte avec label et validation
- **Modal** — Dialog avec focus trap, escape key, backdrop blur, portail dans `document.body`, ton `violet` ou `danger`
- **Badge** — Badges colorés (`green`, `red`, `primary`, `gray`, `amber`)
- **ExamCard** — Carte d'examen avec badge de statut, compteur de questions, date
- **StatCard** — Carte de statistiques avec icône, valeur, sous-label et trend
- **Loader** — Animation de chargement avec label
- **EmptyState** — État vide avec icône, titre, description
- **ErrorMessage** — Message d'erreur avec icône et bouton retry
- **ErrorBoundary** — Classe React component pour capturer les erreurs avec rechargement

---

## 9. Styling et design system

**Q : Comment le design system est-il implémenté ?**

R :
- **TailwindCSS 4** avec `@theme` définissant une palette custom (primary-50 à primary-900, navy #0F1030)
- Couleurs primary : violet/fuchsia (#8B5CF6, #5535FB, etc.)
- Couleur navy pour le fond principal (#0F1030)
- Animations CSS personnalisées : `fade-in`, `scale-in`, `dot-bounce`, `fade-in-up`, `slide-in-left`, `highlight-row`
- Responsive design : breakpoints `md:` et `lg:` pour sidebar mobile/tablet/desktop
- Icônes **Lucide React** avec `size` prop
- Toasts via **Sonner** (`toast.success()`, `toast.error()`)

---

## 10. Squelettes (Skeletons) et états de chargement

**Q : Comment les états de chargement sont-ils gérés ?**

R : Des composants skeleton sont utilisés partout pour un meilleur UX :
- `SkeletonRows` — Listes avec animation pulse (StudentsPage, ExamsPage)
- `SkeletonCards` — Grille de cartes (CoursesPage)
- `ExamCardSkeleton`, `TakeExamSkeleton`, `StudentResultsSkeleton`, `ExamResultSkeleton` — Pages student
- Le `Loader` est utilisé sur le dashboard student

---

## 11. Validation des formulaires

**Q : Comment la validation est-elle gérée ?**

R : Validation côté client manuelle dans chaque composant :
- **StudentsPage** : Email regex, mot de passe ≥8 caractères, nom obligatoire, gestion des conflits 409
- **CoursesPage** : Code obligatoire, nom, description, détection des codes dupliqués
- **ExamForm** : Cours, titre, dates obligatoires, fin > début
- **QuestionForm** : Énoncé, points (1-5 entier), ≥2 choix texte, exactement 1 choix correct, max 6 choix

Les erreurs sont stockées dans un état `errors` objet et affichées sous chaque champ.

---

## 12. Configuration et build

**Q : Comment le projet est-il configuré pour le dev et la production ?**

R :
- **vite.config.js** : Port 5173, proxy `/api` → `http://localhost:8080`
- **Variable d'environnement** : `VITE_API_URL` (défaut `/api`)
- **ESLint** : Config moderne avec `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **Build** : `vite build` → dossier `dist/`
- Le `.env.example` est vide (à compléter)

---

## 13. Points techniques importants

**Q : Quels sont les points techniques notables du code ?**

R :
- L'état auth persiste dans `localStorage` pour maintenir la session entre les rechargements
- Les `useEffect` utilisent souvent un pattern `ignore` flag pour éviter les mises à jour d'état sur composants démontés
- Le `ExamForm` convertit les dates entre format ISO et datetime-local
- `QuestionForm` gère 2 à 6 choix avec un radio pour sélectionner la réponse correcte
- `TakeExamPage` collecte les réponses dans un objet `{ questionId: choiceId }` avant soumission
- La validation d'un examen sur la `QuestionsPage` se fait via `totalAttempts > 0` (si des résultats existent, l'examen est verrouillé)
- `ExamResultPage` détermine si l'étudiant a validé l'examen avec `score >= maxScore / 2`
- Le `StudentResultsPage` utilise `getScoreColorClass(score, maxScore)` pour colorer les résultats
- Les layouts (`AdminLayout`, `StudentLayout`) sont responsives avec sidebar mobile (hamburger), tablet (icons only), desktop (full sidebar)

---

## 14. Gestion des erreurs

**Q : Comment les erreurs sont-elles gérées dans l'application ?**

R :
- `ApiError` classe personnalisée avec `message` et `status`
- `401` → suppression automatique du token et redirection vers le login
- Les pages utilisent des états `error` avec `ErrorMessage` composant (bouton retry)
- `ErrorBoundary` comme composant racine pour les erreurs non gérées
- Les toasts `sonner` pour les feedback utilisateurs (succès/erreur)
- Les modales de confirmation (suppression) isolent les actions destructrices

---

## 15. Flux utilisateur typique

**Q : Décrivez le parcours utilisateur typique ?**

R :
1. **Anonyme** → SplashScreen (3s) → LoginPage → Authentification
2. **Admin** → AdminDashboard → Gestion users/cours/exams/questions/results
3. **Étudiant** → StudentDashboard → ExamStudentPage → TakeExamPage → ExamResultPage
4. Chaque étape est protégée par `ProtectedRoute` + `RoleRoute`
5. Le logout nettoie localStorage et redirige vers `/login`