/// <reference types="cypress"/>
const _ = Cypress._


describe('define the expectation table', () => {
 describe('findAllMacros', () => {
  it('returns a list of macros', () => {
   expect(findAllMacros(expectation)).to.not('be.empty')
  });
 });

})