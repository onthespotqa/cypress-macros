export function lex(str, {onMacro, onText}) {
  for(let i = 0; i < str.length; ) {
    const j = str.indexOf('{', i)
    const k = j >= 0 ? str.indexOf('}', j) : str.length

    if(j >= 0) {
      if(j > 0 && i < j)
        if(onText) onText(str.slice(i, j))
      const spelling = str.slice(j+1, k >= 0 ? k : undefined).trim()
      if(spelling)
        if(onMacro) onMacro(spelling)
      if( k >= 0)
        i = k + 1
      else
        i = str.length
    } else {
      const spelling = str.slice(i)
      if(onText) onText(spelling)
      i = str.length
    }
  }
}

