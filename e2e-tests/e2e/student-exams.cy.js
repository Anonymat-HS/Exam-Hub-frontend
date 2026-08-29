describe('Examens étudiant — /student/exams', () => {
  const day = 60 * 60 * 24 * 1000;

  function openExam() {
    const now = Date.now();
    return {
      id: 1,
      title: 'Examen Final Génie Logiciel',
      description: 'Examen ouvert en ce moment',
      questionCount: 10,
      startDate: new Date(now - 3 * day).toISOString(),
      endDate: new Date(now + 2 * day).toISOString(),
    };
  }

  function upcomingExam() {
    const now = Date.now();
    return {
      id: 2,
      title: 'Contrôle Web 2 — Sessions',
      description: 'Examen programmé plus tard',
      questionCount: 5,
      startDate: new Date(now + 5 * day).toISOString(),
      endDate: new Date(now + 8 * day).toISOString(),
    };
  }

  beforeEach(() => {
    cy.loginAsStudent();
    cy.intercept('GET', '**/api/my/exams*', (req) => {
      if (req.query.status === 'upcoming') {
        req.reply([upcomingExam()]);
      } else {
        req.reply([openExam()]);
      }
    }).as('getMyExams');
    cy.visit('/student/exams');
    cy.wait('@getMyExams');
  });

  it('affiche les examens ouverts par défaut avec un bouton Commencer actif', () => {
    // Then : l'examen ouvert s'affiche
    cy.contains('Examen Final Génie Logiciel').should('be.visible');

    // et le bouton Commencer est actif (non désactivé)
    cy.contains('button', 'Commencer').should('be.visible').and('not.be.disabled');
  });

  it('affiche un examen à venir avec le bouton Commencer désactivé', () => {
    // When : l'étudiant bascule sur l'onglet "À venir"
    cy.contains('button', 'À venir').click();
    cy.wait('@getMyExams');

    // Then : l'examen à venir s'affiche
    cy.contains('Contrôle Web 2 — Sessions').should('be.visible');

    // et le bouton Commencer est désactivé
    cy.contains('button', 'Commencer').should('be.visible').and('be.disabled');
  });
});
