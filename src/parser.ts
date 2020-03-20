/**
 * Given the first word of dot-separated macro expression, transform it into
 * a proper Cypress variable reference including the @ character.
 */
export function canonicalize(name: string): string {
  switch (name.slice(0, 1)) {
    case "@":
      return name;
    case "$":
      return name;
    default:
      return `@${name}`;
  }
}

export interface LexOptions {
  onMacro?: (string) => void;
  onText?: (string) => void;
}

/**
 * Find the innermost pairs of curly braces containing a single word with no spaces.
 * 
 * Returns an array of pairs of integers, where each pair contains the index
 * of the open curly brace, then the index of the close curly brace. The pairs
 * are sorted in the order they appear in the input string.
 * 
 * e.g.
 * - findMacroBoundaries('hello {FUND1}') = [[6, 12]]
 * - findMacroBoundaries('{FUND1} {FUND2}') = [[0, 6],[8, 14]] // detects multiple macros
 * - findMacroBoundaries('hello {FUND1.id}') = [[6, 15]] // detects with dots
 * - findMacroBoundaries('hello {  FUND1 }') = [[6, 15]] // detects with leading/trailing whitespace
 * - findMacroBoundaries('hello {FUND 1}') = [] // ignores due to internal space
 * - findMacroBoundaries('hello FUND1') = []
 * - findMacroBoundaries('hello {FUND1') = []
 * - findMacroBoundaries('hello FUND1}') = []
 * - findMacroBoundaries('hello {}') = [] // ignores empty pairs
 * - findMacroBoundaries('{ a: { c: { d: {FUND1} } }, b: {FUND2} }') = [[15, 21], [31, 37]]
 */
function findMacroBoundaries(str: string): [number, number][] {
  const boundaries: [number, number][] = [];
  const stack: number[] = [];
  let innermostPair = false;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{') {
      stack.push(i);
      innermostPair = true;
    } else if (str[i] === '}') {
      const openIndex = stack.pop();
      if (innermostPair && openIndex !== undefined) {
        boundaries.push([openIndex, i]);
      }
      innermostPair = false;
    }
  }

  return boundaries.filter(([startIndex, endIndex]) => {
    const macro = str.slice(startIndex + 1, endIndex).trim();
    return macro.length > 0 && !macro.includes(' ');
  });
}

/**
 * Perform lexical analysis on str, extracting all tokens (e.g. runs of text
 * or macro expressions); call onMacro and onText as each token is encountered.
 */
export function lex(str: string, options: LexOptions) {
  const { onText = () => {}, onMacro = () => {} } = options;
  const boundaries = findMacroBoundaries(str);
  let initialIndex = 0;

  boundaries.forEach(([startIndex, endIndex]) => {
    const text = str.slice(initialIndex, startIndex);
    text && onText(text);

    const macro = str.slice(startIndex + 1, endIndex).trim();
    macro && onMacro(macro);

    initialIndex = endIndex + 1;
  })

  const suffixText = str.slice(initialIndex);
  suffixText && onText(suffixText);
}
