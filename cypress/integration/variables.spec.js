import { variables } from "../../src";

describe("macro variables", () => {
  describe("add", () => {
    it("requires $", () => {
      expect(() => variables.add("foo")).to.throw(
        "cypress-macros: variable name 'foo' must begin with a $"
      );
    });

    it("allows replacement", () => {
      variables.add("$replaced", () => false);
      cy.evalMacros("{$replaced}").should("be", "false");
      variables.add("$replaced", () => true);
      variables.reset();
      cy.evalMacros("{$replaced}").should("be", "true");
    });
  });

  describe("reset", () => {
    let telltale = "foo";
    variables.add("$counter", () => telltale);

    it("works", () => {
      cy.evalMacros("{$telltale}").should("be", "foo");
      variables.reset();
      telltale = "bar";
      cy.evalMacros("{$telltale}").should("be", "bar");
    });
  });
});
