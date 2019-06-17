import { variables } from "../../src";

describe("macro variables", () => {
  describe("add", () => {
    it("requires $", () => {
      expect(() => variables.add("foo")).to.throw(
        "cypress-macros: variable name 'foo' must begin with a $"
      );
    });

    it("allows replacement", () => {
      variables.reset();
      variables.add("$replaced", () => false);
      cy.evalMacros("{$replaced}").should("eq", "false");
      variables.add("$replaced", () => true);
      variables.reset();
      cy.evalMacros("{$replaced}").should("eq", "true");
    });
  });

  describe("reset", () => {
    let telltale = "foo";
    variables.add("$counter", () => telltale);

    it("works", () => {
      cy.evalMacros("{$telltale}").should("eq", "foo");
      variables.reset();
      telltale = "bar";
      cy.evalMacros("{$telltale}").should("eq", "bar");
    });
  });
});
