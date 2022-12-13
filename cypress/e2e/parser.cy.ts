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
  function expectBoundariesToContain(str, matches) {
    const boundaries = findMacroBoundaries(str);

    expect(boundaries.length).to.eql(matches.length);

    boundaries.map(([startIndex, endIndex], i) => {
      // + 1 because we dont care about the opening curly brace
      expect(str.slice(startIndex + 1, endIndex)).to.eql(matches[i]);
    });
  }

  it("detects simple macros", () => {
    expectBoundariesToContain("hello {world}", ["world"]);
  });

  it("detects multiple macros", () => {
    expectBoundariesToContain("{hello} {world}", ["hello", "world"]);
  });

  it("detects macros with dots", () => {
    expectBoundariesToContain("hello {world.city}", ["world.city"]);
  });

  it("detects macros with leading and trailing spaces", () => {
    expectBoundariesToContain("hello {  world }", ["  world "]);
  });

  it("ignores macros with internal spaces", () => {
    expectBoundariesToContain("hello {wo rld}", []);
  });

  it("handles text which is only a macro", () => {
    expectBoundariesToContain("{world}", ["world"]);
  });

  it("handles text with no macros", () => {
    expectBoundariesToContain("hello world", []);
  });

  it("handles unmatched open braces", () => {
    expectBoundariesToContain("hello {world", []);
  });

  it("handles unmatched close braces", () => {
    expectBoundariesToContain("hello world}", []);
  });

  it("ignores empty brace pairs", () => {
    expectBoundariesToContain("hello {}", []);
  });

  it("handles complex json structures", () => {
    expectBoundariesToContain("{ a: { c: { d: {hello} } }, b: {world} }", [
      "hello",
      "world"
    ]);
  });
});

describe("lex", () => {
  function all(str) {
    const tokens: string[] = [];
    lex(str, {
      onMacro: t => tokens.push(`{${t}}`),
      onText: t => tokens.push(t)
    });
    return tokens;
  }

  it("recognizes macros and delivers them with no curlies", () => {
    let tokens: string[] = [];
    lex("{hi} {bob}", { onMacro: t => tokens.push(t) });
    expect(tokens).to.eql(["hi", "bob"]);
  });

  it("recognizes multi-word macros", () => {
    let tokens: string[] = [];
    lex("{cap.name} {cap.weapon}", { onMacro: t => tokens.push(t) });
    expect(tokens).to.eql(["cap.name", "cap.weapon"]);
  });

  it("recognizes plain text", () => {
    let tokens: string[] = [];
    lex("{defenders} of {justice}", { onText: t => tokens.push(t) });
    expect(tokens).to.eql([" of "]);
  });

  it("handles json structures", () => {
    let text: string[] = [];
    let macros: string[] = [];
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
