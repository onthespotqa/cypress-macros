import { variables } from "../../src";

describe("macro variables", () => {
  describe("add", () => {
    it("requires $", () => {
      expect(() => variables.add("foo")).to.throw(
        "cypress-macros: variable name 'foo' must begin with a $"
      );
    });

    it("allows replacement", () => {
      cy.wrap(null).then(() => {
        variables.reset();
        variables.add("$replaced", () => false);
      });
      cy.evalMacros("{$replaced}").should("eq", "false");

      cy.wrap(null).then(() => {
        variables.reset();
        variables.add("$replaced", () => true);
      });
      cy.evalMacros("{$replaced}").should("eq", "true");
    });
  });

  describe("reset", () => {
    let telltale = "foo";
    variables.add("$telltale", () => telltale);

    it("works", () => {
      cy.evalMacros("{$telltale}").should("eq", "foo");
      cy.wrap(null).then(() => {
        variables.reset();
        telltale = "bar";
      });
      cy.evalMacros("{$telltale}").should("eq", "bar");
    });
  });
});
