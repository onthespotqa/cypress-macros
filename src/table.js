import invariant from 'invariant';
import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import ArrayComparer from './ArrayComparer';

//TODO: Handle large Percentages for Dynamic Ownership Percentages
//TODO: Handle Dollar Amounts for Contributed & Contributed
//TODO: Handle Dollar Amounts for Unreturned Capital

function assertTableExpectationsMatched(arrayComparer, type) {
  invariant(
    arrayComparer.unmatchedExpectedElements.length === 0,
    `All expected ${type} must exist in actual table.\n
    Unmatched expectations: \n${JSON.stringify(
      arrayComparer.unmatchedExpectedElements,
      null,
      2
    )}\n
    Unmatched actuals: \n${JSON.stringify(
      arrayComparer.unmatchedActualElements,
      null,
      2
    )}`
  );
}

function assertTableActualsMatched(arrayComparer, type) {
  invariant(
    arrayComparer.unmatchedActualElements.length === 0,
    `All actual ${type} must exist in expected table.\n
    Unmatched actuals: \n${JSON.stringify(
      arrayComparer.unmatchedActualElements,
      null,
      2
    )}\n
    Unmatched expectations: \n${JSON.stringify(
      arrayComparer.unmatchedExpectedElements,
      null,
      2
    )}`
  );
}

function assertMatchOrder(arrayComparer, type) {
  const matchIndices = arrayComparer.expectedArrayData.map(
    ({ matchIndex }) => matchIndex
  );

  invariant(
    isEqual(matchIndices, orderBy(matchIndices)),
    `Expected ${type} must be in the same order as the actual ${type}.\n
    Expected order: \n${JSON.stringify(
      arrayComparer.expectedArrayData.map(({ element, index }) => ({
        element,
        index,
      })),
      null,
      2
    )}\n
    Actual order: \n${JSON.stringify(
      arrayComparer.matchedActualElements,
      null,
      2
    )}`
  );
}

function assertTableMatch(arrayComparer, type, enforceMatch, enforceOrder) {
  assertTableExpectationsMatched(arrayComparer, type);
  if (enforceMatch) {
    assertTableActualsMatched(arrayComparer, type);
  }
  if (enforceOrder) {
    assertMatchOrder(arrayComparer, type);
  }
}

function compareTables(
  tableA,
  tableB,
  { exactColumns, exactRows, orderedColumns, orderedRows }
) {
  const [headersA, ...rowsA] = tableA;
  const [headersB, ...rowsB] = tableB;
  const headerComparer = new ArrayComparer(headersA, headersB);

  assertTableMatch(headerComparer, 'headers', exactColumns, orderedColumns);

  const convertedRows = rowsA.map(row =>
    headerComparer.expectedArrayData.map(({ matchIndex }) => row[matchIndex])
  );

  const rowComparer = new ArrayComparer(convertedRows, rowsB);

  assertTableMatch(rowComparer, 'rows', exactRows, orderedRows);

  return true;
}

function getValueOrDefault(getter, defaultGetter, ...args) {
  const value = getter(...args);

  return value === undefined || value === null ? defaultGetter(...args) : value;
}

const defaultHeaderGetter = th => th.text().trim();
const defaultCellGetter = td => td.text().trim();

export function expectTableContent(
  table,
  {
    selector = 'table',
    headerGetter = defaultHeaderGetter,
    cellGetter = defaultCellGetter,
    exactColumns = false,
    exactRows = false,
    orderedColumns = false,
    orderedRows = false,
  } = {}
) {
  cy.get(selector).should(t => {
    const htmlHeaders = [];
    const htmlRows = [];

    t.find('th').each((index, th) => {
      htmlHeaders.push(
        getValueOrDefault(
          headerGetter,
          defaultHeaderGetter,
          Cypress.$(th),
          index
        )
      );
    });

    t.find('tbody tr:not([hidden])').each((rowIndex, tr) => {
      htmlRows.push([]);

      Cypress.$(tr)
        .find('td')
        .each((colIndex, td) => {
          const header = htmlHeaders[colIndex];

          htmlRows[rowIndex].push(
            getValueOrDefault(
              cellGetter,
              defaultCellGetter,
              Cypress.$(td),
              header,
              rowIndex
            )
          );
        });
    });

    expect(
      compareTables([htmlHeaders, ...htmlRows], table, {
        exactColumns,
        exactRows,
        orderedColumns,
        orderedRows,
      })
    ).to.equal(true);
  });
}
