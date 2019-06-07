beforeEach(() => {
  cy.wrap({ name: "Batman", weapon: "fatalism" }).as("bat");
  cy.wrap({ name: "Captain America", weapon: "shield" }).as("cap");
  cy.wrap({ name: "Iron Man", weapon: "repulsor" }).as("iron");
});

describe("evalMacros", () => {
  context("input types", () => {
    it("works with strings", () => {
      cy.evalMacros("{bat.weapon} vs {iron.weapon}?").should(
        "eql",
        "fatalism vs repulsor?"
      );
    });

    it("works with lists", () => {
      cy.evalMacros(["{cap.name}", "{iron.name}"]).should("eql", [
        "Captain America",
        "Iron Man"
      ]);
    });

    it("works with tables", () => {
      cy.evalMacros([
        ["{cap.name}", "{iron.name}"],
        ["{cap.weapon}", "{iron.weapon}"]
      ]).should("eql", [
        ["Captain America", "Iron Man"],
        ["shield", "repulsor"]
      ]);
    });
  });
});
