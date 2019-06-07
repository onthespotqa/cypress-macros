import { canonicalize, lex } from "../../src/parser";

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

  it("preserves whitespace", () => {
    expect(all("foo {bar}")).to.eql(["foo ", "{bar}"]);
    expect(all(" foo{bar}")).to.eql([" foo", "{bar}"]);
    expect(all("foo  {bar}")).to.eql(["foo  ", "{bar}"]);
    expect(all("foo  {bar}")).to.eql(["foo  ", "{bar}"]);
    expect(all("foo{bar} ")).to.eql(["foo", "{bar}", " "]);
    expect(all("   foo {bar}baz   ")).to.eql(["   foo ", "{bar}", "baz   "]);
  });

  it("does multiples", () => {
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
    expect(all("foo{bar")).to.eql(["foo", "{bar}"]);
    expect(all("{foo")).to.eql(["{foo}"]);
  });
});
