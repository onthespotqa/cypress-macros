let _lodash = require('lodash');
import { format } from 'date-fns';


//TODO: Handle fact that the % in the Total Row has a trailing space
//TODO: Handle large Percentages for Dynamic Ownership Percentages
//TODO: Handle Dollar Amounts for Contributed & Contributed
//TODO: Handle Dollar Amounts for Unreturned Capital


//Get the Results of all the Variables from findAllVarRefs

export function cyGetAll(names) {
  let chain = cy;
  const values = {};
  names.forEach(name => {
    chain = chain.get(name).then(value => (values[name] = value));
  });
  return chain.then(() => values);
}

//In the DataTable find all macros used
export function findAllMacros(expectation) {

}

//In the Result of findAllMacros, then strip the variable @X part and then return the uniq set
export function findalsVarRefs(macroContents) {

}

export function evalAllMacros(expectation, lookupTable) {

}

export function defineTable(dataTable) {
  var outputTable = [];
  dataTable.rawTable().forEach(expectation => {
    cyGetAll(findAllVarRefs(findAllMacros(expectation))).then(
      lookupTable => outputTable.push(evalAllMacros(dataTable, lookupTable))
    )
  })
  return cy.wrap(outputTable);
}
