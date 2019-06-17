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

describe("commands", () => {
  describe("evalMacros", () => {
    context("macro expressions", () => {
      it("replaces macro variables", () => {
        cy.evalMacros("{$today.year}").should("eq", new Date().getFullYear().toString());
        cy.evalMacros("{$villains.major.0}").should("eq", "Faustus");
      });

      it("replaces cypress variables", () => {
        cy.evalMacros("{@bat.name}").should("eq", "Batman");
        cy.evalMacros("{@bat.suit.color}").should("eq", "black");
      });

      it("replaces implicit cypress variables", () => {
        cy.evalMacros("{iron.name}").should("eq", "Iron Man");
        cy.evalMacros("{iron.suit.color}").should("eq", "red");
      });
    });

    context("parameters", () => {
      it("accepts strings", () => {
        cy.evalMacros("{bat.weapon} vs {iron.weapon}?").should(
          "eql",
          "fatalism vs repulsor?"
        );
      });

      it("accepts lists", () => {
        cy.evalMacros(["{cap.name}", "vs.", "{iron.name}"]).should("eql", [
          "Captain America",
          "vs.",
          "Iron Man"
        ]);
      });

      it("accepts tables", () => {
        cy.evalMacros([
          ["Name", "Weapon", "Number"],
          ["{cap.name}", "{iron.name}", "1"],
          ["{cap.weapon}", "{iron.weapon}", "2"]
        ]).should("eql", [
          ["Name", "Weapon", "Number"],
          ["Captain America", "Iron Man", "1"],
          ["shield", "repulsor", "2"]
        ]);
      });
    });
  });
});
