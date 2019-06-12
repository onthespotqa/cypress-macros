import { commands } from "../../src";

Cypress.Commands.add("evalMacros", { prevSubject: false }, commands.evalMacros);
