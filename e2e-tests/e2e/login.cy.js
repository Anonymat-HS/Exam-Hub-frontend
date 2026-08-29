describe('Connexion (Login)', () => {
  beforeEach(() => {
    cy.interceptAuth();
    cy.visit('/login');
  });

  it('connecte un administrateur valide et redirige vers /admin', () => {
    // Given : l'utilisateur est sur la page de connexion (beforeEach)

    // When : il saisit des identifiants admin valides et soumet
    cy.get('#email').type('admin@examhub.com');
    cy.get('#password').type('password');
    cy.contains('button', 'Se connecter').click();

    // Then : redirection vers le tableau de bord admin
    cy.url().should('include', '/admin');
  });

  it('connecte un étudiant valide et redirige vers /student/exams', () => {
    // When : il saisit des identifiants étudiant valides et soumet
    cy.get('#email').type('student@examhub.com');
    cy.get('#password').type('password');
    cy.contains('button', 'Se connecter').click();

    // Then : redirection vers l'espace examens étudiant
    cy.url().should('include', '/student/exams');
  });

  it('affiche un message d\'erreur pour des identifiants invalides', () => {
    // When : l'utilisateur soumet de mauvais identifiants
    cy.get('#email').type('admin@examhub.com');
    cy.get('#password').type('wrong-password');
    cy.contains('button', 'Se connecter').click();

    // Then : un message d'erreur s'affiche
    cy.contains('Identifiants incorrects').should('be.visible');
    // et on reste sur /login
    cy.url().should('include', '/login');
  });

  it('redirige un utilisateur déjà connecté vers la bonne zone', () => {
    // Given : un utilisateur admin est déjà authentifié en localStorage
    cy.loginAsAdmin();
    cy.visit('/login');

    // Then : il est redirigé vers /admin sans soumettre de formulaire
    cy.url().should('include', '/admin');
  });
});
