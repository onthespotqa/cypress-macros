/// <reference types="cypress"/>
const _ = Cypress._
import { expectationTable, findAllMacros, findAllVarRefs, cyGetAll } from '../../src/expectation'


describe('define the expectation table', () => {
  describe('findAllMacros', () => {
   it('is not an empty array', () => {
    let expectation = ["Array", "{@X.name}"]
 
    expect(findAllMacros(expectation)).to.not.be.empty
    expect(findAllMacros(expectation)).to.be.instanceOf(Array)
   });
 
   it('returns all values that meet the pattern', () => {
    let expectation = ["not dynamic", "{@X.name}", "{@X1.first_name} {@X1.last_name}", "{@X2.last_name}, {@X2.first_name}", "{today.short}"]
    expect(findAllMacros(expectation)).to.eql(["@X.name", "@X1.first_name", "@X1.last_name", "@X2.last_name", "@X2.first_name", "today.short"])
   });
  });
 
  describe('findAllVarRefs', () => {
   it('handles corner cases', () => {
     expect(findAllVarRefs([])).to.eql([])
     expect(findAllVarRefs([])).to.eql([])
   })
   it('returns only the uniq variable', () => {
    let expectation = ["@X.name", "@X1.first_name", "@X1.last_name", "@X2.last_name", "@X2.first_name", "@X2.name", "today.short"]
    expect(findAllVarRefs(expectation)).to.eql(["@X", "@X1", "@X2"])
   });
  });
 
  describe('cyGetAll', () => {
 
   it('returns cypress variables in the system', () => {
    cy.fixture('cap').as('cap')
    cy.fixture('iron').as('iron')
    
    cyGetAll(["@cap", "@iron"]).then(result => {
      expect(result).to.not.be.empty
      expect(result['@cap']).to.include({name: 'Captain America'})
      expect(result['@iron']).to.include({name: 'Iron Man'})
    })
   });
  });
 
 })
 
describe.skip('expectationTable', () => {
 beforeEach(function () {
  console.log('am i run?')
  cy.fixture('thor').storeAs('thor');
  cy.fixture('cap').storeAs('cap');
  cy.fixture('iron').storeAs('iron');
  cy.fixture('date').storeAs('today');
 });


 it('returns the table passed in if there are no macros', () => {
  let dataTable = [
   ["Name", "Weapon"],
   ["Captain America", "Shield"]
  ]
  expect(expectationTable(dataTable)).to.eql(dataTable)
 })


 it('returns rows with no macros and rows with all macros', () => {
  let dataTable = [
   ["Name", "Weapon"],
   ["{cap.name}", "{cap.weapon}"]
  ]
  let expected = [
   ["Name", "Weapon"],
   ["Captain America", "Shield"]
  ]
  expect(expectationTable(dataTable)).to.eql(expected)
 });

 it('returns multiple rows with macros', () => {
  let dataTable = [
   ["Name", "Weapon"],
   ["{cap.name}", "{cap.weapon}"],
   ["{iron.name}", "{iron.weapon}"]
  ]
  let expected = [
   ["Name", "Weapon"],
   ["Captain America", "Shield"],
   ["Iron Man", "Gauntlet"]
  ]
  expect(expectationTable(dataTable)).to.eql(expected)
 })

 it('returns multiple rows with macros', () => {
  let dataTable = [
   ["Name", "Weapon", "Power Level"],
   ["{cap.name}", "{cap.weapon}", "1"],
   ["{iron.name}", "{iron.weapon}", "3"]
  ]
  let expected = [
   ["Name", "Weapon", "Power Level"],
   ["Captain America", "Shield", "1"],
   ["Iron Man", "Gauntlet", "3"]
  ]
  expect(expectationTable(dataTable)).to.eql(expected)
 })

 it('returns date formats for today', () => {
  let dataTable = [
   ["Short", "Long", "Current Year"],
   ["{today.short}", "{today.long}", "{today.year}"]
  ]
  let expected = [
   ["Short", "Long", "Current Year"],
   ["6/1/19", "06/01/2019", "2019"]
  ]
  expect(expectationTable(dataTable)).to.eql(expected)
 })

 it('returns a mixture of strings and dates', () => {
  let dataTable = [
   ["Name", "Weapon", "Power Level", "Rating Date"],
   ["{cap.name}", "{cap.weapon}", "1", "{today.short}"],
   ["{iron.name}", "{iron.weapon}", "3", "{today.long}"]
  ]
  let expected = [
   ["Name", "Weapon", "Power Level", "Rating Date"],
   ["Captain America", "Shield", "1", "6/1/19"],
   ["Iron Man", "Gauntlet", "3", "06/01/2019"]
  ]
  expect(expectationTable(dataTable)).to.eql(expected)
 })

 it('replaces multiple macros in the string', () => {
  let dataTable = [
   ["What is the Perferred Weapon?"],
   ["{cap.name} perferred is a {cap.weapon}"]
  ]
  let expected = [
   ["What is the Perferred Weapon?"],
   ["Captain America perferred is a Shield"]
  ]
  expect(expectationTable(dataTable)).to.eql(expected)
 })
})
