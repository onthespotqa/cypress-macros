# What Is This?

[![CircleCI](https://circleci.com/gh/onthespotqa/cypress-macros.svg?style=svg)](https://circleci.com/gh/onthespotqa/cypress-macros)

This package contains a Cypress command called `evalMacros` that makes it
easier to write tests for web applications whose test data is generated
dynamically. By binding API responses to cypress `@` aliases, you can
refer to dynamic data when verifying the contents of the DOM. For
example, if the logged-in user is bound to the `@user` alias, you could
check for a greeting:

```js
cy.evalMacros('Hello, {@user.firstName}')
  .then(greeting => cy.contains('.header div', greeting))
```

The `@` is optional when referring to a Cypress alias; in the example above,
`{user.firstName}` would yield the same result.

### Macro Variables

In addition to Cypress aliases, this package supports a system of lightweight
macro variables for values that don't need the full power of Cypress aliases
(asynchrony, rebinding, etc). Macro variables begin with a `$` to distinguish
them from Cypress variables:

```js
cy.evalMacros('I last saw {@user.nickname} on {$today.dayOfWeek}).then(
  seen => cy.contains(seen)
)
```

The `$` is mandatory when referencing a macro variable in order to distinguish
them from Cypress aliases.

Macro variables are good for values such as "today's date" that vary
between test runs but are known before the tests begin executing.
You can register as many variables as you want, and you decide how
long the variables remain in scope by calling a reset function
at the appropriate time.

If your variables are expected to change between test cases, we
strongly suggest that you hook the Cypress `test:before:run` event
to reset the variables before every test case (see sample code below).
The default behavior is to instantiate them the first time `evalMacros`
is called and never to reset them, which makes them act more like
constants than variables.

## Setup

### Add Custom Command

In `cypress/support/commands.js`,  add the custom commands:

```js
import { commands as macros } from 'cypress-macros';

macros.add()

```

You can rename the custom command to something different if desired, or even
overwrite the `contains` built-in command so that it automatically
interpolates macro expressions.

### Add Macro Variables

If you want to use macro variables in addition to Cypress variables, we
recommend that you create a `cypress/support/variables.js` to define
macro variables and install a required Cypress event hook.

```js
import { variables } from 'cypress-macros';

// Optional: recompute all variables before every test case to avoid
// stale values.
Cypress.on("test:before:run", () => {
  variables.reset();
});

variables.add("$today", () => {
  return {
    dayOfWeek: new Date().getDay(),
    year: new Date().getFullYear()
  };
});
```

Don't forget to `import "./variables"` in `cypress/support/index.js`!

## Cucumber Parameter Type

If you are using [cypress-cucumber-preprocessor](https://www.npmjs.com/package/cypress-cucumber-preprocessor),
you can define a custom parameter type that allows you to use a macro as a
placeholder in a step definition.

In a step definition file named `_setup.js` (so it runs first), place the
following code:

```
import {canonicalize} from 'cypress-macros/parser'

defineParameterType({
 name: "macro",
 regexp: /\{(.*)\}/,
 transformer: s => canonicalize(s) 
})
```

Because macros are evaluated asynchronously, you will still need to evaluate
the macro in each step definition where it is used by calling `evalMacros`
on your step parameters, but the use of curly braces allows for some nice
syntactic sugar in your Cucumber features:

```
When I click the link {@user.nickname}
```

This avoids the excessive puncutation that would result if you used a `{string}`
to capture macro expressions (`When I do "{@foo}"`).
