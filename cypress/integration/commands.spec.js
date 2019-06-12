beforeEach(() => {
  cy.wrap({
    name: "Batman",
    weapon: "fatalism",
    suit: { color: "black" }
  }).as("bat");
  cy.wrap({
    name: "Captain America",
    weapon: "shield",
    suit: { color: "red, white and blue" }
  }).as("cap");
  cy.wrap({
    name: "Iron Man",
    weapon: "repulsor",
    suit: { color: "red" }
  }).as("iron");
});

describe("evalMacros", () => {
  context("macro expressions", () => {
    it("handles macro globals", () => {
      cy.evalMacros("{$today.year}").should("be", new Date().getFullYear());
    });

    it("handles cypress variables", () => {
      cy.evalMacros("{@bat.name}").should("be", "Batman");
    });

    it("handles implicit cypress variables", () => {
      cy.evalMacros("{iron.name}").should("be", "Iron Man");
    });

    it("handles compound get", () => {
      cy.evalMacros("{bat.suit.color}").should("be", "black");
    });
  });

  context("input types", () => {
    it("works with strings", () => {
      cy.evalMacros("{bat.weapon} vs {iron.weapon}?").should(
        "be",
        "fatalism vs repulsor?"
      );
    });

    it("works with lists", () => {
      cy.evalMacros(["{cap.name}", "{iron.name}"]).should("be", [
        "Captain America",
        "Iron Man"
      ]);
    });

    it("works with tables", () => {
      cy.evalMacros([
        ["{cap.name}", "{iron.name}"],
        ["{cap.weapon}", "{iron.weapon}"]
      ]).should("be", [
        ["Captain America", "Iron Man"],
        ["shield", "repulsor"]
      ]);
    });

    it("works with a cuke datatable", () => {
      cy.evalMacros([
        ["Name", "Weapon", "Number"],
        ["{cap.name}", "{iron.name}", "1"],
        ["{cap.weapon}", "{iron.weapon}", "2"]
      ]).should("be", [
        ["Name", "Weapon", "Number"],
        ["Captain America", "Iron Man", "1"],
        ["shield", "repulsor", "2"]
      ]);
    });
  });
});
