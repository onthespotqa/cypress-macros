import * as commands from "./commands";
import * as variables from "./variables";

/**
 * Parameter signature for Cypress commands that require a callback.
 */
type CommandCallback = (subject: any) => any;

/**
 * Subset of the Cypress chainable interface used by this package.
 */
export interface Chainable {
  get(s0: string): Chainable;
  then(f0: CommandCallback): Chainable;
  wrap(f0: CommandCallback): Chainable;
}

/**
 * A lookup table that maps Cypress or macro variable names to their values.
 */
export type Dictionary = Record<string, any>;

export { commands, variables };
