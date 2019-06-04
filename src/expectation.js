import {lex} from './lex'

//TODO: Handle large Percentages for Dynamic Ownership Percentages
//TODO: Handle Dollar Amounts for Contributed & Contributed
//TODO: Handle Dollar Amounts for Unreturned Capital

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

//In the DataTable row, find all macros used. Return them in the order in which they occur in the input strings.
export function findAllMacros(expectation) {
  const macros = [];
  expectation.forEach(str => lex(str, {onMacro: t => macros.push(t)}))
  return macros;
}

//In the Result of findAllMacros, then strip the variable @X part and then return the uniq set
export function findAllVarRefs(macroContents) {
  const uniq = {};
  console.log('ts>', macroContents)
  macroContents.forEach(t => {
    const [prefix] = t.split('.', 2)
    console.log('ts>  ', prefix)
    if(prefix.startsWith('@')) uniq[prefix] = true
  })
  return Object.keys(uniq)
}

//Evaluations all the Macros and finds their cypress values lookupTable from cyGetAll
export function evalAllMacros(expectation, lookupTable) {

}

//Builds the expectationTable to pass to expectTableContent
export function expectationTable(dataTable) {
  var outputTable = [];
  dataTable.forEach(expectation => {
    cyGetAll(findAllVarRefs(findAllMacros(expectation))).then(
      lookupTable => outputTable.push(evalAllMacros(dataTable, lookupTable))
    )
  })
  return cy.wrap(outputTable);
}

export function replaceMacro(match) {
  const alias = trim(match).split(".")[0];
  const attr = trim(match).split(".")[1];
  return 'TODO';
}

