import { commands } from "../../src";

Cypress.Commands.add("evalMacros", { prevSubject: false }, commands.evalMacros);
Cypress.Commands.add(
  "getAllByName",
  { prevSubject: false },
  commands.getAllByName
);
