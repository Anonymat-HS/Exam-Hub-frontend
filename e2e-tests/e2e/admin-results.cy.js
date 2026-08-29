describe('Résultats d\'un examen (admin) — /admin/exams/:id/results', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    const now = Date.now();
    const day = 60 * 60 * 24 * 1000;

    cy.intercept('GET', '**/api/exams/1', {
      id: 1,
      title: 'Examen Final Génie Logiciel',
      course: { id: 1, code: 'GEN2', name: 'Génie Logiciel 2' },
      startDate: new Date(now - 3 * day).toISOString(),
      endDate: new Date(now + 2 * day).toISOString(),
      totalPoints: 20,
    }).as('getExamDetail');

    cy.intercept('GET', '**/api/exams/1/results', { fixture: 'results-admin' }).as('getResults');

    cy.visit('/admin/exams/1/results');
    cy.wait('@getResults');
  });

  it('affiche la moyenne, les tentatives et les lignes de résultats', () => {
    // Given : l'admin consulte les résultats de l'examen 1 (beforeEach)

    // Then : la moyenne correspond à la fixture (14.5 / 20)
    cy.visibleText('Moyenne').should('exist');
    cy.visibleText('14.5 / 20').should('exist');

    // et le nombre de tentatives
    cy.visibleText('Tentatives').should('exist');
    cy.visibleText('3').should('exist');

    // et les lignes de résultats des étudiants mockés
    cy.visibleText('Ando').should('exist');
    cy.visibleText('Marie').should('exist');
    cy.visibleText('Lalao').should('exist');
  });
});
