import { Dictionary } from ".";

type Factory = () => any;

const registry: Record<string, Factory> = {};

/**
 * Add (or replace) a macro variable definition. Name must omit
 * the leading $ and factory should be a callback that instantiates
 * the variable's value object when it is called.
 */
export function add(name: string, factory: Factory) {
  if (!name.startsWith("$"))
    throw new Error(
      `cypress-macros: variable name '${name}' must begin with a $`
    );
  registry[name] = factory;
}

let instance: Dictionary = {};
let instantiated = false;
/**
 * Instantiate a Dictionary containing all defined variables. If
 * variables were already instantiated since the beginning of the
 * Cypress test invocation, reuse the existing instantiation of
 * the variables.
 */
export function instantiate(): Dictionary {
  if (!instantiated) {
    Object.entries(registry).forEach(
      ([name, factory]) => (instance[name] = factory())
    );
    instantiated = true;
  }

  return instance;
}

export function reset() {
  instance = {};
  instantiated = false;
}
