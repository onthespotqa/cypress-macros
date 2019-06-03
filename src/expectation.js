
import { testStore } from '../cypress/support/commands.js'
import { trim } from './common.js'
let regex = new RegExp(/\{(.*?)\}/g);



export function replaceMacro(match) {
  const alias = trim(match).split(".")[0];
  const attr = trim(match).split(".")[1];
  console.log(testStore);
  return testStore[alias][attr];
}

//Builds the expectationTable to pass to expectTableContent
export function expectationTable(dataTable) {
  let expectedTable = dataTable.map(value =>
    value.map(e => e.replace(regex, replaceMacro))
  );
  return expectedTable;
}
