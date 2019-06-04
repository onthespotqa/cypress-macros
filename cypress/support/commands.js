// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { format } from 'date-fns'

export const testStore = {}


Cypress.Commands.add('storeAs', { prevSubject: true }, (value, propName) => {
 console.log('prop: ' + propName + ' value: ' + value)
 testStore[propName] = value;
 console.log(testStore);
 return value;
})


// Cypress.Commands.add('clean', () => {
//  testStore[propName] = value;
//  return value;
// })


export const regex = new RegExp(/\{(.*?)\}/g);

// Alternatively you can use CommonJS syntax:
// require('./commands')


// export const now = new Date();
// var today = {
//  short: format(now, ''),
//  long: format(now, 'DD-MM-YYY'),
//  year: format(now, 'YYYY')
// }


// today.storeAs('today');



