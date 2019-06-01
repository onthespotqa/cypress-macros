import lex from '../../src/lex'

function all(str) {
  const tokens = [];
  lex(str, {onMacro: t => tokens.push(`{${t}}`), onText: t => tokens.push(t)})
  return tokens;
}

it('preserves whitespace', () => {
  expect(all('foo {bar}')).to.eql(['foo ','{bar}'])
  expect(all(' foo{bar}')).to.eql([' foo','{bar}'])
  expect(all('foo  {bar}')).to.eql(['foo  ','{bar}'])
  expect(all('foo  {bar}')).to.eql(['foo  ','{bar}'])
  expect(all('foo{bar} ')).to.eql(['foo','{bar}', ' '])
  expect(all('   foo {bar}baz   ')).to.eql(['   foo ', '{bar}', 'baz   '])
})

it('does multiples', () => {
  expect(all('{foo} bar {baz}')).to.eql(['{foo}', ' bar ', '{baz}'])
  expect(all('{foo}{bar}{baz}')).to.eql(['{foo}', '{bar}', '{baz}'])
  expect(all('{foo} {bar} {baz}')).to.eql(['{foo}', ' ', '{bar}', ' ', '{baz}'])
  expect(all('  {foo} {bar} {baz}  ')).to.eql(['  ', '{foo}', ' ', '{bar}', ' ', '{baz}', '  '])
})

it('handles corner cases', () => {
  expect(all('quux}')).to.eql(['quux}'])
  expect(all('foo{bar')).to.eql(['foo', '{bar}'])
  expect(all('{foo')).to.eql(['{foo}'])
})
