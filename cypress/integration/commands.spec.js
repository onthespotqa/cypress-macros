beforeEach(() => {
  cy.wrap({
    name: "Batman",
    weapon: "fatalism",
    suit: { color: "black" },
    birthday: new Date(Date.parse("1939-09-19"))
  }).as("bat");
  cy.wrap({
    name: "Captain America",
    weapon: "shield",
    suit: { color: "red, white and blue" },
    birthday: new Date(Date.parse("1920-07-04"))
  }).as("cap");
  cy.wrap({
    name: "Iron Man",
    weapon: "repulsor",
    suit: { color: "red" },
    birthday: new Date(Date.parse("1970-05-29"))
  }).as("iron");
});

describe("commands", () => {
  describe("evalMacros", () => {
    context("macro expressions", () => {
      it("replaces macro variables", () => {
        cy.evalMacros("{$today.year}").should(
          "eq",
          new Date().getFullYear().toString()
        );
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
      3;
    });

    context("non-macro expressions", () => {
      it("ignores null", () => {
        cy.evalMacros(null).should("eql", null);
        cy.evalMacros([null]).should("eql", [null]);
      });

      it("ignores undefined", () => {
        cy.evalMacros(undefined).should("eql", undefined);
        cy.evalMacros([undefined]).should("eql", [undefined]);
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

    context("options.force", () => {
      it("disregards {}", () => {
        cy.evalMacros("bat.name", { force: true }).should("eql", "Batman");

        cy.evalMacros("{bat.name}", { force: true }).should("eql", "Batman");
      });

      it("works with lists", () => {
        cy.evalMacros(["bat.name", "{cap.name}"], { force: true }).should(
          "eql",
          ["Batman", "Captain America"]
        );
      });
    });

    context("options.raw", () => {
      it("does not stringify expressions", () => {
        cy.evalMacros("bat.birthday", { force: true, raw: true }).should(
          "be.an.instanceof",
          Date
        );

        cy.evalMacros("{bat.birthday}", { force: true, raw: true }).should(
          "be.an.instanceof",
          Date
        );
      });

      it("works with force:true", () => {
        cy.evalMacros(["bat.birthday", "cap.birthday", "iron.birthday"], {
          force: true,
          raw: true
        }).then(values =>
          values.forEach(value => expect(value).to.be.instanceof(Date))
        );
      });
    });
  });

  describe("getAllByName", () => {
    it("works", () => {
      cy.getAllByName(["@cap", "@bat", "@iron"]).then(result => {
        expect(result).to.have.property("@cap");
        expect(result).to.have.property("@bat");
        expect(result).to.have.property("@iron");
        expect(result["@cap"].name).to.eq("Captain America");
        expect(result["@bat"].name).to.eq("Batman");
        expect(result["@iron"].name).to.eq("Iron Man");
      });
    });
  });
});
