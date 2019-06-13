What Is This?
=============

This package contains a Cypress command called `evalMacros` that makes it
easier to write tests for web applications whose test data is generated
dynamically. By binding API responses to cypress `@` variables, you can
refer to dynamic data when verifying the contents of the DOM. For
example, if the logged-in user is bound to the `@user` alias, you could
check for a greeting:

```
cy.evalMacros('Hello, {user.firstName}').then(greeting => cy.contains('.header div', greeting))
```

Setup
-----

Just import the commands module and add `evalMacros` as a custom command.

```
import { commands } from 'cypress-macros';

Cypress.Commands.add('evalMacros', { prevSubject: false }, commands.evalMacros);
```

You can rename it to something different if desired, or even overwrite the
`contains` built-in command so that it automatically interpolates.
