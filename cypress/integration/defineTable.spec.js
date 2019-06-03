/// <reference types="cypress"/>
const _ = Cypress._
import { cyGetAll, findAllMacros, findallVarRefs } from '../../src/defineTable'


describe('define the expectation table', () => {
 describe('findAllMacros', () => {
  xit('is not an empty array', () => {
   let expectation = ["Array", "{@X.name}"]

   expect(findAllMacros(expectation)).to.not.be.empty
   expect(findAllMacros(expectation)).to.be.instanceOf(Array)
  });

  xit('returns all values that meet the pattern', () => {
   let expectation = ["not dynamic", "{@X.name}", "{@X1.first_name} {@X1.last_name}", "{@X2.last_name}, {@X2.first_name}", "{today.short}"]
   expect(findAllMacros(expectation)).to.eql(["{@X.name}", "{@X1.first_name} {@X1.last_name}", "{@X2.last_name}, {@X2.first_name}", "{today.short}"])
  });
 });

 describe('findalsVarRefs', () => {
  xit('is not an empty array', () => {
   let expectation = ["not dynamic", "{@X.name}", "{@X1.first_name} {@X1.last_name}", "{@X2.last_name}, {@X2.first_name}", "{today.short}"]
   expect(findallVarRefs(expectation)).to.not.be.empty
   expect(findallVarRefs(expectation)).to.be.instanceOf(Array)
  });

  xit('is returns only the uniq variable', () => {
   let expectation = ["not dynamic", "{@X.name}", "{@X1.first_name} {@X1.last_name}", "{@X2.last_name}, {@X2.first_name}", "{@X2.name}", "{today.short}"]
   expect(findallVarRefs(expectation)).to.eql(["@X", "@X1", "@X2"])
  });
 });

 describe('cyGetAll', () => {

  it('returns cypress variables in the system', () => {
   cy.fixture('example').as('X')
   cy.fixture('example2').as('X2')
   let varRefs = ["@X", "@X2"]
   console.log(cyGetAll(varRefs));
   expect(cyGetAll(varRefs)).to.not.be.empty
   cy.log(cyGetAll(varRefs)['@X'])
   //expect(cyGetAll(varRefs)["@X"]).to.not.be.empty
   expect(cyGetAll(varRefs)["@X"]).to.eql({ "name": "apples" })

   //expect(all).to.be.eql([{ "name": "apples" }]);
  });
 });

})