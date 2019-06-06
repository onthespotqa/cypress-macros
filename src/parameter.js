/* global defineParameterType, then, when */
import { canonicalize } from './expectation'

defineParameterType({
 name: "macro",
 regexp: /\{(.*?)\}/,
 transformer(s) {
  let [key, value] = s.split('.', 2)
  const name = canonicalize(key)
  const path = value;
  return { name: name, path: path }
 }
})