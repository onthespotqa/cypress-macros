let _lodash = require('lodash');
import { format } from 'date-fns';


//TODO: Handle large Percentages for Dynamic Ownership Percentages
//TODO: Handle Dollar Amounts for Contributed & Contributed
//TODO: Handle Dollar Amounts for Unreturned Capital

function trim(s) {
  return (s || '').replace(/^\{|\}$/g, '');
}

//Get the Results of all the Variables from findAllVarRefs
export function cyGetAll(names) {
  let chain = cy;
  const values = {};
  names.forEach(name => {
    chain = chain = chain.get(name).then(value => (values[name] = value));
  });

  console.log(values);
  return chain.then(() => values);
}

//In the DataTable find all macros used
export function findAllMacros(expectation) {
  const dynamicValues = _lodash.filter(_lodash.flattenDeep(expectation), function (o) {
    return new RegExp(/\{(.*?)\}/g).test(o);
  });
  return dynamicValues
}

//In the Result of findAllMacros, then strip the variable @X part and then return the uniq set
export function findallVarRefs(macroContents) {
  var cyVars = [];
  const varRefs = _lodash.filter(_lodash.flattenDeep(macroContents), function (o) {
    return new RegExp(/\{@(.*?)\}/g).test(o);
  });
  varRefs.forEach(r => {
    cyVars.push(trim(r.split('.')[0]));
  })
  return _lodash.uniq(cyVars);
}

//Evaluations all the Macros and finds their cypress values lookupTable from cyGetAll
export function evalAllMacros(expectation, lookupTable) {

}

//Builds the expectationTable to pass to expectTableContent
export function defineTable(dataTable) {
  var outputTable = [];
  dataTable.forEach(expectation => {
    cyGetAll(findAllVarRefs(findAllMacros(expectation))).then(
      lookupTable => outputTable.push(evalAllMacros(dataTable, lookupTable))
    )
  })
  return cy.wrap(outputTable);
}
