describe('Gestion des examens (admin) — /admin/exams', () => {
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  function buildExams() {
    const now = Date.now();
    return [
      {
        id: 1,
        title: 'Examen Final Génie Logiciel',
        description: 'QCM de fin de semestre',
        courseId: 1,
        course: { id: 1, code: 'GEN2', name: 'Génie Logiciel 2' },
        startDate: new Date(now - 3 * day).toISOString(),
        endDate: new Date(now + 2 * day).toISOString(),
      },
      {
        id: 2,
        title: 'Contrôle Web 2 — Sessions',
        description: 'Examen à venir',
        courseId: 2,
        course: { id: 2, code: 'WEB2', name: 'Développement Web 2' },
        startDate: new Date(now + 5 * day).toISOString(),
        endDate: new Date(now + 8 * day).toISOString(),
      },
      {
        id: 3,
        title: 'Examen Base de Données 2',
        description: 'Examen terminé',
        courseId: 3,
        course: { id: 3, code: 'BDD2', name: 'Bases de Données 2' },
        startDate: new Date(now - 10 * day).toISOString(),
        endDate: new Date(now - 5 * day).toISOString(),
      },
    ];
  }

  beforeEach(() => {
    cy.loginAsAdmin();
    cy.intercept('GET', '**/api/courses', { fixture: 'courses' }).as('getCourses');
    cy.intercept('GET', '**/api/exams', (req) => {
      if (req.query.courseId) {
        const id = Number(req.query.courseId);
        req.reply(buildExams().filter((e) => e.courseId === id));
      } else {
        req.reply(buildExams());
      }
    }).as('getExams');
    cy.visit('/admin/exams');
    cy.wait('@getExams');
  });

  it('affiche la liste des examens avec leurs statuts calculés', () => {
    // Then : les trois examens de la fixture s'affichent
    cy.visibleText('Examen Final Génie Logiciel').should('exist');
    cy.visibleText('Contrôle Web 2 — Sessions').should('exist');
    cy.visibleText('Examen Base de Données 2').should('exist');

    // et leurs statuts (Ouvert / À venir / Terminé)
    cy.visibleText('Ouvert').should('exist');
    cy.visibleText('À venir').should('exist');
    cy.visibleText('Terminé').should('exist');
  });

  it('filtre les examens par recherche côté client', () => {
    // When : l'admin recherche "Base de Données"
    cy.get('input[placeholder="Rechercher..."]').first().type('Base de Données');

    // Then : seul l'examen correspondant reste visible
    cy.visibleText('Examen Base de Données 2').should('exist');
    cy.visibleText('Examen Final Génie Logiciel').should('not.exist');
  });
});
