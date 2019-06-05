import {get as lodashGet} from 'lodash' 
import {instantiate} from './constants'
import {lex} from './lex'

//TODO: Handle large Percentages for Dynamic Ownership Percentages
//TODO: Handle Dollar Amounts for Contributed & Contributed
//TODO: Handle Dollar Amounts for Unreturned Capital

//Get the Results of all the Variables from findAllVarRefs
function cyGetAll(names) {
  let chain = cy;
  const values = {};
  names.forEach(name => {
    chain = chain = chain.get(name).then(value => (values[name] = value));
  });

  return chain.then(() => values);
}

// Given the first word of dot-separated macro expression, transform it into
// a proper Cypress variable reference including the @ character.
function canonicalize(name) {
  switch(name.slice(0,1)) {
    case '@', '$':
      return name;
    default:
      return `@${name}`
  }
}

// Given a data table (2D array), replace all macros and return a Cypress
// chainable that resolves to the macro-substituted result (another 2D
// array with the same dimension as dataTable).
export function expectationTable(dataTable) {
  //Build Out the Variables to Look For
  const allVariables = {};

  dataTable.forEach(expectation => 
    expectation.forEach(cell => {
      lex(cell, {onMacro: t => {
        let [name] = t.split('.', 2)
        name = canonicalize(name)
        if(name.startsWith('@'))
          allVariables[name] = true;
      }})
    })
  )

  // Asynchronously resolve all distinct variables, then substitute.
  return cyGetAll(Object.keys(allVariables)).then(lookupTable => {
    const outputTable = [];

    const macroConstants = instantiate();

    dataTable.forEach(expectation => {
      const outputRow = [];
      expectation.forEach(cell => {
        const outputCell = []
        lex(cell, {onText: t => outputCell.push(t), onMacro: t => {
          let [name, path] = t.split('.', 2)
          name = canonicalize(name)
          if(name.startsWith('@')) { // Variable reference
            const object = lookupTable[name]
            const substitutedValue = lodashGet(object, path)
            outputCell.push(substitutedValue)
          } else { // Constant reference            
            const object = macroConstants[name.slice(1)]
            const substitutedValue = lodashGet(object, path)
            outputCell.push(substitutedValue)
          }
        }})
        outputRow.push(outputCell.join(''))
      })
      outputTable.push(outputRow)
    })

    return outputTable;
  })
}
