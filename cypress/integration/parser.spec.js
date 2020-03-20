import { canonicalize, findMacroBoundaries, lex } from "../../src/parser";

describe("canonicalize", () => {
  it("passes @", () => {
    expect(canonicalize("@foo")).to.eq("@foo");
  });

  it("passes $", () => {
    expect(canonicalize("$foo")).to.eq("$foo");
  });

  it("adds @ by default", () => {
    expect(canonicalize("foo")).to.eq("@foo");
  });
});

describe("findMacroBoundaries", () => {
  it("detects simple macros", () => {
    expect(findMacroBoundaries("hello {world}")).to.eql([[6, 12]]);
  });

  it("detects multiple macros", () => {
    expect(findMacroBoundaries("{hello} {world}")).to.eql([[0, 6], [8, 14]]);
  });

  it("detects macros with dots", () => {
    expect(findMacroBoundaries("hello {world.city}")).to.eql([[6, 17]]);
  });

  it("detects macros with leading and trailing spaces", () => {
    expect(findMacroBoundaries("hello {  world }")).to.eql([[6, 15]]);
  });

  it("ignores macros with internal spaces", () => {
    expect(findMacroBoundaries("hello {wo rld}")).to.eql([]);
  });

  it("handles text which is only a macro", () => {
    expect(findMacroBoundaries("{world}")).to.eql([[0, 6]]);
  });

  it("handles text with no macros", () => {
    expect(findMacroBoundaries("hello world")).to.eql([]);
  });

  it("handles unmatched open braces", () => {
    expect(findMacroBoundaries("hello {world")).to.eql([]);
  });

  it("handles unmatched close braces", () => {
    expect(findMacroBoundaries("hello world}")).to.eql([]);
  });

  it("ignores empty brace pairs", () => {
    expect(findMacroBoundaries("hello {}")).to.eql([]);
  });

  it("ignores empty brace pairs", () => {
    expect(findMacroBoundaries("hello {}")).to.eql([]);
  });

  it("handles complex json structures", () => {
    expect(
      findMacroBoundaries("{ a: { c: { d: {hello} } }, b: {world} }")
    ).to.eql([[15, 21], [31, 37]]);
  });
});

describe("lex", () => {
  function all(str) {
    const tokens = [];
    lex(str, {
      onMacro: t => tokens.push(`{${t}}`),
      onText: t => tokens.push(t)
    });
    return tokens;
  }

  it("recognizes macros and delivers them with no curlies", () => {
    let tokens = [];
    lex("{hi} {bob}", { onMacro: t => tokens.push(t) });
    expect(tokens).to.eql(["hi", "bob"]);
  });

  it("recognizes multi-word macros", () => {
    let tokens = [];
    lex("{cap.name} {cap.weapon}", { onMacro: t => tokens.push(t) });
    expect(tokens).to.eql(["cap.name", "cap.weapon"]);
  });

  it("recognizes plain text", () => {
    let tokens = [];
    lex("{defenders} of {justice}", { onText: t => tokens.push(t) });
    expect(tokens).to.eql([" of "]);
  });

  it("handles json structures", () => {
    let text = [];
    let macros = [];
    const onText = t => text.push(t);
    const onMacro = m => macros.push(m);
    lex("{ a: { c: { d: {nested} } }, b: {shallow} }", { onText, onMacro });
    expect(text).to.eql(["{ a: { c: { d: ", " } }, b: ", " }"]);
    expect(macros).to.eql(["nested", "shallow"]);
  });

  it("preserves whitespace", () => {
    expect(all("foo {bar}")).to.eql(["foo ", "{bar}"]);
    expect(all(" foo{bar}")).to.eql([" foo", "{bar}"]);
    expect(all("foo  {bar}")).to.eql(["foo  ", "{bar}"]);
    expect(all("foo  {bar}")).to.eql(["foo  ", "{bar}"]);
    expect(all("foo{bar} ")).to.eql(["foo", "{bar}", " "]);
    expect(all("   foo {bar}baz   ")).to.eql(["   foo ", "{bar}", "baz   "]);
    expect(all("{foo} bar {baz}")).to.eql(["{foo}", " bar ", "{baz}"]);
    expect(all("{foo}{bar}{baz}")).to.eql(["{foo}", "{bar}", "{baz}"]);
    expect(all("{foo} {bar} {baz}")).to.eql([
      "{foo}",
      " ",
      "{bar}",
      " ",
      "{baz}"
    ]);
    expect(all("  {foo} {bar} {baz}  ")).to.eql([
      "  ",
      "{foo}",
      " ",
      "{bar}",
      " ",
      "{baz}",
      "  "
    ]);
  });

  it("handles corner cases", () => {
    expect(all("quux}")).to.eql(["quux}"]);
    expect(all("foo{bar")).to.eql(["foo{bar"]);
    expect(all("{foo")).to.eql(["{foo"]);
    expect(all("{{quux")).to.eql(["{{quux"]);
  });
});
