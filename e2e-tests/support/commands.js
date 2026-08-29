// Custom commands for Exam Hub E2E tests.
// The app reads token + user from localStorage on load (see src/context/AuthContext.jsx),
// so tests pre-seed those to simulate an authenticated session without any real backend.

Cypress.Commands.add('seedUser', (user) => {
  window.localStorage.setItem('token', 'mock-token');
  window.localStorage.setItem('user', JSON.stringify(user));
});

Cypress.Commands.add('loginAsAdmin', () => {
  window.localStorage.setItem('token', 'mock-token');
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      id: 1,
      email: 'admin@examhub.com',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'Principal',
    })
  );
});

Cypress.Commands.add('loginAsStudent', () => {
  window.localStorage.setItem('token', 'mock-token');
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      id: 2,
      email: 'student@examhub.com',
      role: 'student',
      firstName: 'Ando',
      lastName: 'Etudiant',
    })
  );
});

Cypress.Commands.add('interceptAuth', () => {
  cy.intercept('POST', '**/api/auth/login', (req) => {
    const { email, password } = req.body;
    if (email === 'admin@examhub.com' && password === 'password') {
      req.reply({
        statusCode: 200,
        body: {
          token: 'mock-token',
          user: { id: 1, email, role: 'admin', firstName: 'Admin', lastName: 'Principal' },
        },
      });
    } else if (email === 'student@examhub.com' && password === 'password') {
      req.reply({
        statusCode: 200,
        body: {
          token: 'mock-token',
          user: { id: 2, email, role: 'student', firstName: 'Ando', lastName: 'Etudiant' },
        },
      });
    } else {
      req.reply({
        statusCode: 401,
        body: { message: 'Identifiants incorrects.' },
      });
    }
  }).as('login');
});

// Finds an element that is actually visible on screen and whose text contains the given fragment.
// Several pages render both a mobile (md:hidden) and a desktop (md:table) version of the same
// content; this command ignores the hidden copy so assertions target the rendered view.
Cypress.Commands.add('visibleText', (text) => {
  const needle = String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  cy.get('body', { timeout: 10000 })
    .find('*')
    .filter(':visible')
    .filter((_i, el) => {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      return t === needle || t.includes(needle);
    })
    .first();
});

