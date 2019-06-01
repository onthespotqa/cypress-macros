
import { testStore } from '../cypress/support/commands.js'
import { trim } from './common.js'

let regex = new RegExp(/\{(.*?)\}/g)


//TODO: Handle large Percentages for Dynamic Ownership Percentages
//TODO: Handle Dollar Amounts for Contributed & Contributed
//TODO: Handle Dollar Amounts for Unreturned Capital

export function replaceMacro(match) {
  const alias = trim(match).split(".")[0];
  const attr = trim(match).split(".")[1];
  debugger;
  return testStore[alias][attr];
}

//Builds the expectationTable to pass to expectTableContent
export function expectationTable(dataTable) {
  var expectedTable = dataTable.map(value =>
    value.map(e => e.replace(regex, replaceMacro))
  );
  return expectedTable;
}
