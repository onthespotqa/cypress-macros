import * as commands from "./commands";

/**
 * Label/title parameter accepted by all finders.
 */
export type Text = RegExp | string;

/**
 * Parameter signature for Cypress commands that require a callback.
 */
type Callback = (subject: any) => any;

/**
 * Subset of the Cypress chainable interface used by this package.
 */
export interface Chainable {
  get(s0: string): Chainable;
  then(f0: Callback): Chainable;
  wrap(f0: Callback): Chainable;
}

export { commands };
