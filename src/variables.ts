import { Dictionary } from ".";

type Factory = () => any;

interface State {
  registry: Record<string, Factory>;
  instance: Dictionary;
  instantiated: boolean;
}

declare var Cypress: { _macroVariables: State };
if (!Cypress._macroVariables)
  Cypress._macroVariables = {
    registry: {},
    instance: {},
    instantiated: false
  };

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
  Cypress._macroVariables.registry[name] = factory;
}

/**
 * Instantiate a Dictionary containing all defined variables. If
 * variables were already instantiated since the beginning of the
 * Cypress test invocation, reuse the existing instantiation of
 * the variables.
 */
export function instantiate(): Dictionary {
  if (!Cypress._macroVariables.instantiated) {
    Object.entries(Cypress._macroVariables.registry).forEach(
      ([name, factory]) => (Cypress._macroVariables.instance[name] = factory())
    );
    Cypress._macroVariables.instantiated = true;
  }

  return Cypress._macroVariables.instance;
}

export function reset() {
  Cypress._macroVariables.instance = {};
  Cypress._macroVariables.instantiated = false;
}
