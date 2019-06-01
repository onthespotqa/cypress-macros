/// <reference types="cypress"/>
const _ = Cypress._
import { testStore } from '../support/commands.js'

describe('testStore', () => {

 describe('stores Fixtures', () => {
  beforeEach(function () {
   cy.fixture('thor').storeAs('thor');
   cy.fixture('cap').storeAs('cap');
   cy.fixture('iron').storeAs('iron');
  });

  it('stores thor in the testStore', () => {
   expect(testStore['thor']).to.eql({ "name": "Thor", "weapon": "Moljnr" });
  })

  it('stores cap in the testStore', () => {
   expect(testStore['cap']).to.eql({ "name": "Captain America", "weapon": "Shield" });
  })

  it('stores iron in the testStore', () => {
   expect(testStore['iron']).to.eql({ "name": "Iron Man", "weapon": "Gauntlet" });
  })
 })

 describe('stores Date', () => {
  it('stores today in the format MM-DD-YYYY', () => {
   expect(testStore.today.long).to.not.be.empty
  })
 })

 describe('stores API Body', () => {

 })

});