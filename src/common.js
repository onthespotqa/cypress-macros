let _lodash = require('lodash');
import { testStore } from '../cypress/support/commands.js'
let regex = new RegExp(/\{(.*?)\}/g)

export function trim(s) {
 return (s || '').replace(/^\{|\}$/g, '');
}

//Get the Results of all the Variables from findAllVarRefs
export function accessStorage(names) {
 var values = {};
 names.forEach(name => {
  values[name] = testStore[name]
 });
 return values;
}

//In the DataTable find all macros used
export function findAllMacros(expectation) {
 const dynamicValues = _lodash.filter(_lodash.flattenDeep(expectation), function (o) {
  return regex.test(o);
 });
 return dynamicValues
}

//In the Result of findAllMacros, then strip the variable @X part and then return the uniq set
export function findallVarRefs(macroContents) {
 var cyVars = [];
 macroContents.forEach(r => {
  cyVars.push(trim(r.split('.')[0]));
 })
 return _lodash.uniq(cyVars);
}

