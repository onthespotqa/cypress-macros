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

Custom Cypress Cucumber Parameter 
-----

You can define a custom cypress-cucumber parameter that allows you to use a macro as a placeholder in a step definition by placing the following code in your support or step_definitions directory. 


In a file named _setup.js place the following code: 

```
function canonicalize(name) {
 switch (name.slice(0, 1)) {
  case '@':
   return name;
  case '$':
   return name;
  default:
   return `@${name}`
 }
}

defineParameterType({
 name: "macro",
 regexp: /\{(.*?)\}/,
 transformer(s) {
  let [key, value] = s.split('.', 2)
  const name = canonicalize(key)
  const path = value;
  return { name: name, path: path }
 }
})
```
