/// <reference types="cypress"/>
const _ = Cypress._
import { accessStorage, trim, findAllMacros, findallVarRefs } from '../../src/common.js'
import { testStore } from '../support/commands.js'


describe('common functions', () => {

 describe('findAllMacros', () => {
  it('is not an empty array', () => {
   let expectation = ["Array", "{X.name}"]

   expect(findAllMacros(expectation)).to.not.be.empty
   expect(findAllMacros(expectation)).to.be.instanceOf(Array)
  });

  it('returns all values that meet the pattern', () => {
   let expectation = ["not dynamic", "{X.name}", "{X1.first_name} {X1.last_name}", "{X2.last_name}, {X2.first_name}", "{today.short}"]
   expect(findAllMacros(expectation)).to.eql(["{X.name}", "{X1.first_name} {X1.last_name}", "{X2.last_name}, {X2.first_name}", "{today.short}"])
  });
 });

 describe('findalsVarRefs', () => {

  it('is not an empty array', () => {
   const expectation = ["not dynamic", "{X.name}", "{X1.first_name} {X1.last_name}", "{X2.last_name}, {X2.first_name}", "{today.short}"]
   const macroContents = findAllMacros(expectation)
   expect(findallVarRefs(macroContents)).to.not.be.empty
   expect(findallVarRefs(macroContents)).to.be.instanceOf(Array)
  });

  it('is returns only the uniq variable', () => {
   const expectation = ["not dynamic", "{X.name}", "{X1.first_name} {X1.last_name}", "{X2.last_name}, {X2.first_name}", "{today.short}"]
   const macroContents = findAllMacros(expectation)
   expect(findallVarRefs(macroContents)).to.eql(["X", "X1", "X2", "today"])
  });
 });

 describe('accessStorage', () => {
  beforeEach(function () {
   cy.fixture('thor').storeAs('thor');
   cy.fixture('cap').storeAs('cap');
   cy.fixture('iron').storeAs('iron');
  });

  it('returns only the values from the testStore that match the names passed in', () => {
   let names = ["thor", "cap"]
   expect(accessStorage(names)).to.eql({ thor: { "name": "Thor", "weapon": "Moljnr" }, cap: { "name": "Captain America", "weapon": "Shield" } });
  });

  it('does not return the entire testStore', () => {
   let names = ["thor", "cap"]
   expect(accessStorage(names)).to.not.eql(testStore);
  });
 });

 describe('trim', () => {
  it('strips {', () => {
   expect(trim('{foo')).to.eq('foo');
  });

  it('strips }', () => {
   expect(trim('foo}')).to.eq('foo');
  });

  it('strips {}}', () => {
   expect(trim('{foo}')).to.eq('foo');
  });
 })

})
