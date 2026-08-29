describe('Gestion des utilisateurs (admin) — /admin/users', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.intercept('GET', '**/api/students', { fixture: 'users' }).as('getStudents');
    cy.intercept('DELETE', '**/api/students/*', { statusCode: 204 }).as('deactivateUser');
    cy.intercept('POST', '**/api/students/*/activate', { statusCode: 204 }).as('activateUser');
    cy.visit('/admin/users');
    cy.wait('@getStudents');
  });

  it('affiche la liste des utilisateurs de la donnée mockée', () => {
    // Given : l'admin est connecté et la liste est chargée (beforeEach)

    // Then : les utilisateurs de la fixture s'affichent
    cy.visibleText('Marie').should('exist');
    cy.visibleText('Jean').should('exist');
  });

  it('filtre la liste par recherche côté client', () => {
    // Given : la liste est chargée
    cy.visibleText('Marie').should('exist');
    cy.visibleText('Jean').should('exist');

    // When : l'admin saisit une recherche "Marie"
    cy.get('input[placeholder="Rechercher..."]').type('Marie');

    // Then : seule Marie reste visible et Jean disparaît
    cy.visibleText('Marie').should('exist');
    cy.visibleText('Jean').should('not.exist');
  });

  it('filtre les utilisateurs par statut Désactivés', () => {
    // Given : la liste contient un utilisateur inactif (Jean, id 4)

    // When : l'admin clique sur le filtre "Désactivés"
    cy.visibleText('Désactivés').click();

    // Then : seul l'utilisateur inactif est affiché
    cy.visibleText('Jean').should('exist');
    cy.visibleText('Marie').should('not.exist');
  });

  it('désactive un utilisateur actif puis propose de le réactiver', () => {
    // Given : Marie est un utilisateur actif visible

    // When : l'admin cible Marie via la recherche puis clique Désactiver
    cy.get('input[placeholder="Rechercher..."]').type('Marie');
    cy.visibleText('Désactiver').click();

    // Then : une modale de confirmation apparaît
    cy.visibleText('Désactiver cet utilisateur ?').should('exist');

    // When : il confirme la désactivation
    cy.visibleText('Désactiver').click();
    cy.wait('@deactivateUser');

    // Then : le statut passe à "Désactivé" et le bouton devient "Réactiver"
    cy.visibleText('Désactivé').should('exist');
    cy.visibleText('Réactiver').should('exist');
  });
});
