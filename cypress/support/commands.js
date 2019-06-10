import { commands } from "cypress-macros";

Cypress.Commands.add("evalMacros", { prevSubject: false }, commands.evalMacros);
