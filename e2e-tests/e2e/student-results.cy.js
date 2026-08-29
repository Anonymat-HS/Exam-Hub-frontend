describe('Résultats étudiant — /student/results', () => {
  beforeEach(() => {
    cy.loginAsStudent();
    cy.intercept('GET', '**/api/my/results', { fixture: 'results-student' }).as('getMyResults');
    cy.visit('/student/results');
    cy.wait('@getMyResults');
  });

  it('affiche la liste des résultats de l\'étudiant', () => {
    // Then : les résultats de la fixture s'affichent avec leur note
    cy.visibleText('Examen Final Génie Logiciel').should('exist');
    cy.visibleText('16/20').should('exist');
    cy.visibleText('Examen Base de Données 2').should('exist');
    cy.visibleText('14/20').should('exist');
  });

  it('affiche le détail de la correction après un clic sur Correction', () => {
    // Given : un détail de correction est mocké
    cy.intercept('GET', '**/api/my/exams/1/result', {
      examTitle: 'Examen Final Génie Logiciel',
      score: 16,
      maxScore: 20,
      corrections: [
        {
          questionId: 101,
          questionText: 'Quel langage est utilisé par React ?',
          chosenChoiceId: 1,
          chosenChoiceText: 'JavaScript',
          correctChoiceId: 1,
          correctChoiceText: 'JavaScript',
          pointsEarned: 1,
          pointsPossible: 1,
          isCorrect: true,
        },
        {
          questionId: 102,
          questionText: 'Que veut dire HTTP ?',
          chosenChoiceId: 2,
          chosenChoiceText: 'Hyper Text Transfer Protocol',
          correctChoiceId: 2,
          correctChoiceText: 'Hyper Text Transfer Protocol',
          pointsEarned: 1,
          pointsPossible: 1,
          isCorrect: true,
        },
      ],
    }).as('getResultDetail');

    // When : l'étudiant clique sur "Correction" pour le premier résultat
    cy.visibleText('Correction').first().click();
    cy.wait('@getResultDetail');

    // Then : la correction détaillée s'affiche
    cy.visibleText('Correction détaillée').should('exist');
    cy.visibleText('Quel langage est utilisé par React ?').should('exist');
    cy.visibleText('Que veut dire HTTP ?').should('exist');
  });
});
