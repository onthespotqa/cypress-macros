/// <reference types="cypress"/>
const _ = Cypress._
import { canonicalize } from '../../src/expectation'
import { format } from 'date-fns';

describe('canonicalize', () => {
 it('return itself if @', () => {
  expect(canonicalize('@foo')).to.eq('@foo')
 })

 it('return itself if $', () => {
  expect(canonicalize('$foo')).to.eq('$foo')
 })

 it('returns defaults to @ if no prefix', () => {
  expect(canonicalize('foo')).to.eq('@foo');
 })
})