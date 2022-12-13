import * as commands from "./commands";
import * as variables from "./variables";

/**
 * Parameter signature for Cypress commands that require a callback.
 */
export type CommandCallback = (subject: any) => any;

/**
 * A lookup table that maps Cypress or macro variable names to their values.
 */
export type Dictionary = Record<string, any>;

export { commands, variables };
