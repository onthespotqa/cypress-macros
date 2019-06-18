import get from "lodash/get";
import { Chainable, Dictionary } from ".";
import { canonicalize, lex } from "./parser";
import { instantiate } from "./variables";

declare var cy: Chainable;

/**
 * Anything that can be evaluated by evalMacros.
 */
export type Evaluatable = string | string[] | string[][];

/**
 * Test whether an Evaluatable can be map'd, forEach'd, etc.
 */
function isSequence(input: Evaluatable): input is string[] {
  return Array.isArray(input);
}

/**
 * Recursively lex all strings in an Evaluatable, adding every distinct macro
 * expression encountered to a map of string-to-boolean. The expressions are
 * not canonicalized, manipulated or deduplicated; they appear in the same
 * order as in the input.
 */
function findMacros(input: Evaluatable, macros: string[]) {
  if (isSequence(input)) {
    input.forEach(elem => findMacros(elem, macros));
  } else if (typeof input === "string") {
    lex(input, {
      onMacro: (expr: string) => macros.push(expr)
    });
  } else {
    throw new Error(
      `cypress-macros: cannot findMacros in a(n) '${typeof input}'`
    );
  }

  return macros;
}

/**
 * Given a dictionary of Cypress variables and another of macro variables,
 * replace all macro expressions with their evaluated value.
 */
function replaceMacros(
  input: Evaluatable,
  cvars: Dictionary,
  mvars: Dictionary
): any {
  if (isSequence(input)) {
    return input.map(elem => replaceMacros(elem, cvars, mvars));
  } else if (typeof input === "string") {
    const fragments = new Array<string>();
    lex(input, {
      onMacro: (expr: string) => {
        const [prefix, ...path] = expr.split(".");
        const name = canonicalize(prefix);
        let value = name.startsWith("$") ? mvars[name] : cvars[name];
        if (path.length > 0) value = get(value, path);
        fragments.push(value);
      },
      onText: (text: string) => fragments.push(text)
    });
    return fragments.join("");
  }
  throw new Error(
    `cypress-macros: cannot findMacros in a(n) '${typeof input}'`
  );
}

/**
 * Call cy.get on each element of names; resolve with a lookup table that maps
 * each name to its value. The list is non deduplicated; if a name appears
 * more than once, it will be gotten multiple times (which is probably
 * useless).
 */
function getAll(names: string[]): Chainable {
  let chain = cy;
  const values = {};
  names.forEach(name => {
    chain = chain = chain.get(name).then(value => (values[name] = value));
  });
  return chain.then(() => values);
}

/**
 * Replace all macro expressions in the input with their values; resolve
 * with a copy of input where all macros have been replaced.
 *
 * Input may be a simple string, or a string array of any dimension
 * (e.g. string[], string[][], and so forth).
 */
export function evalMacros(input: Evaluatable): Chainable {
  const macros = new Array<string>();
  findMacros(input, macros);

  const prefixes = {};
  macros.forEach(macro => {
    const dot = macro.indexOf(".");
    const prefix = canonicalize(dot > 0 ? macro.slice(0, dot) : macro);
    prefixes[prefix] = true;
  });

  const cvarNames = Object.keys(prefixes).filter(k => k.startsWith("@"));

  return getAll(cvarNames).then((cvars: Dictionary) => {
    const mvars = instantiate();
    return replaceMacros(input, cvars, mvars);
  });
}
