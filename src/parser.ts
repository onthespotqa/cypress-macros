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
 * Perform lexical analysis on str, extracting all tokens (e.g. runs of text
 * or macro expressions); call onMacro and onText as each token is encountered.
 */
export function lex(str: string, options: LexOptions) {
  for (let i = 0; i < str.length; ) {
    const j = str.indexOf("{", i);
    const k = j >= 0 ? str.indexOf("}", j) : str.length;

    if (j >= 0) {
      if (j > 0 && i < j && options.onText) options.onText(str.slice(i, j));
      const spelling = str.slice(j + 1, k >= 0 ? k : undefined).trim();
      if (spelling && options.onMacro) options.onMacro(spelling);
      if (k >= 0) i = k + 1;
      else i = str.length;
    } else {
      const spelling = str.slice(i);
      if (options.onText) options.onText(spelling);
      i = str.length;
    }
  }
}
