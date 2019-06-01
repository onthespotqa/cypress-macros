import isEqual from 'lodash/isEqual';

function convertArrayToArrayData(array) {
  return array.map((element, index) => ({
    index,
    element,
    matchIndex: -1,
  }));
}

export default class ArrayComparer {
  constructor(actualArray, expectedArray, { comparisonFunc = isEqual } = {}) {
    this.actualArrayData = convertArrayToArrayData(actualArray);
    this.expectedArrayData = convertArrayToArrayData(expectedArray);
    this.comparisonFunc = comparisonFunc;

    this.calculateOverlap();
  }

  calculateOverlap() {
    this.expectedArrayData.forEach(
      ({ element: expectedArrayElement, index: expectedArrayIndex }) => {
        const foundIndex = this.actualArrayData.findIndex(
          ({
            element: actualArrayElement,
            matchIndex: actualArrayMatchIndex,
          }) =>
            actualArrayMatchIndex === -1 && // the actual element has not been matched yet
            this.comparisonFunc(actualArrayElement, expectedArrayElement) // the elements are equal
        );

        if (foundIndex >= 0) {
          this.actualArrayData[foundIndex].matchIndex = expectedArrayIndex;
          this.expectedArrayData[expectedArrayIndex].matchIndex = foundIndex;
        }
      }
    );
  }

  get unmatchedActualElements() {
    return this.actualArrayData
      .filter(({ matchIndex }) => matchIndex === -1)
      .map(({ element, index }) => ({ element, index }));
  }

  get matchedActualElements() {
    return this.actualArrayData
      .filter(({ matchIndex }) => matchIndex !== -1)
      .map(({ element, index }) => ({ element, index }));
  }

  get unmatchedExpectedElements() {
    return this.expectedArrayData
      .filter(({ matchIndex }) => matchIndex === -1)
      .map(({ element, index }) => ({ element, index }));
  }

  get matchedExpectedElements() {
    return this.expectedArrayData
      .filter(({ matchIndex }) => matchIndex !== -1)
      .map(({ element, index }) => ({ element, index }));
  }
}
