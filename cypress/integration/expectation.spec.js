/// <reference types="cypress"/>
const _ = Cypress._
import { expectationTable } from '../../src/expectation'
import { format } from 'date-fns';


describe('expectationTable', () => {
 beforeEach(function () {
  cy.fixture('thor').as('thor');
  cy.fixture('cap').as('cap');
  cy.fixture('iron').as('iron');
 });


 it('returns the table passed in if there are no macros', () => {
  const dataTable = [
   ["Name", "Weapon"],
   ["Captain America", "Shield"]
  ]
  expectationTable(dataTable).should('eql', dataTable)
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
  expectationTable(dataTable).should('eql', expected)
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
  expectationTable(dataTable).should('eql', expected)
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
  expectationTable(dataTable).should('eql', expected)
 })

 it('returns date formats for today', () => {
  const now = new Date();
  let dataTable = [
   ["Short", "Long", "Current Year"],
   ["{$today.short}", "{$today.long}", "{$today.year}"]
  ]
  let expected = [
   ["Short", "Long", "Current Year"],
   [format(now, 'M/D/YY'), format(now, 'MM/DD/YYYY'), format(now, 'YYYY')]
  ]
  expectationTable(dataTable).should('eql', expected)
 })

 it('returns a mixture of strings and dates', () => {
  const now = new Date();
  let dataTable = [
   ["Name", "Weapon", "Power Level", "Rating Date"],
   ["{cap.name}", "{cap.weapon}", "1", "{$today.short}"],
   ["{iron.name}", "{iron.weapon}", "3", "{$today.long}"]
  ]
  let expected = [
   ["Name", "Weapon", "Power Level", "Rating Date"],
   ["Captain America", "Shield", "1", format(now, 'M/D/YY')],
   ["Iron Man", "Gauntlet", "3", format(now, 'MM/DD/YYYY')]
  ]
  expectationTable(dataTable).should('eql', expected)
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
  expectationTable(dataTable).should('eql', expected)
 })

 it('replaces multiple macros in the string', () => {
  let dataTable = [
   ["First, Last"],
   ["{cap.name}, {cap.weapon}"]
  ]
  let expected = [
   ["First, Last"],
   ["Captain America, Shield"]
  ]
  expectationTable(dataTable).should('eql', expected)
 })

 it('replaces multiple macros in the string', () => {
  let dataTable = [
   ["MacroText"],
   ["{cap.name}Pending Transfer"]
  ]
  let expected = [
   ["MacroText"],
   ["Captain AmericaPending Transfer"]
  ]
  expectationTable(dataTable).should('eql', expected)
 })

 it.only('replaces a macro starting with @', () => {
  let dataTable = [
   ["MacroText"],
   ["{@iron.name}Pending Transfer"]
  ]
  let expected = [
   ["MacroText"],
   ["Iron ManPending Transfer"]
  ]
  expectationTable(dataTable).should('eql', expected)
 })



})
