const FUNCTIONS = {
  sin: (x, radians) => Math.sin(radians ? x : x * Math.PI / 180),
  cos: (x, radians) => Math.cos(radians ? x : x * Math.PI / 180),
  tan: (x, radians) => Math.tan(radians ? x : x * Math.PI / 180),
  asin: (x, radians) => radians ? Math.asin(x) : Math.asin(x) * 180 / Math.PI,
  acos: (x, radians) => radians ? Math.acos(x) : Math.acos(x) * 180 / Math.PI,
  atan: (x, radians) => radians ? Math.atan(x) : Math.atan(x) * 180 / Math.PI,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  asinh: Math.asinh,
  acosh: Math.acosh,
  atanh: Math.atanh,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  neg: (x) => -x,
  ln: Math.log,
  log: Math.log10,
  log2: Math.log2,
  exp: Math.exp,
  sqr: (x) => x ** 2,
  cube: (x) => x ** 3,
  inv: (x) => 1 / x,
  pow10: (x) => 10 ** x,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  fact: factorial,
  root: (x, degree) => x ** (1 / degree),
  ncr: (n, r) => factorial(n) / (factorial(r) * factorial(n - r)),
  npr: (n, r) => factorial(n) / factorial(n - r),
}

function factorial(value) {
  if (!Number.isInteger(value) || value < 0 || value > 170) throw new Error('Factorial requires an integer from 0 to 170.')
  let answer = 1
  for (let i = 2; i <= value; i += 1) answer *= i
  return answer
}

function tokenize(input) {
  const tokens = []
  const matcher = /\s*(?:(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d+))?|([A-Za-z]+|π)|([()+\-×÷*/^!,%]))/y
  let index = 0
  while (index < input.length) {
    matcher.lastIndex = index
    const match = matcher.exec(input)
    if (!match) throw new Error(`Unexpected character: ${input[index]}`)
    index = matcher.lastIndex
    if (match[1]) tokens.push({ type: 'number', value: Number(`${match[1]}${match[2] ? `e${match[2]}` : ''}`) })
    else if (match[3]) tokens.push({ type: 'name', value: match[3].toLowerCase() })
    else tokens.push({ type: match[4], value: match[4] })
  }
  return tokens
}

export function evaluateExpression(input, isRadianMode = true, answer = 0) {
  const tokens = tokenize(input)
  let position = 0
  const peek = () => tokens[position]
  const consume = (type) => {
    const token = peek()
    if (!token || token.type !== type) throw new Error(`Expected ${type}.`)
    position += 1
    return token
  }
  const parseExpression = () => {
    let value = parseTerm()
    while (peek()?.type === '+' || peek()?.type === '-') {
      const operator = tokens[position++].type
      const right = parseTerm()
      value = operator === '+' ? value + right : value - right
    }
    return value
  }
  const startsPrimary = (token) => token && (token.type === 'number' || token.type === 'name' || token.type === '(')
  const parseTerm = () => {
    let value = parseUnary()
    while (peek()) {
      const type = peek().type
      const isModulo = type === 'name' && peek().value === 'mod'
      if (type === '×' || type === '*' || type === '÷' || type === '/' || isModulo || startsPrimary(peek())) {
        const operator = type === '×' || type === '*' ? '×' : type === '÷' || type === '/' ? '÷' : isModulo ? '%' : '×'
        if (isModulo || ['×', '*', '÷', '/'].includes(type)) position += 1
        const right = parseUnary()
        value = operator === '×' ? value * right : operator === '÷' ? value / right : value % right
      } else break
    }
    return value
  }
  const parseUnary = () => {
    if (peek()?.type === '+') {
      position += 1
      return parseUnary()
    }
    if (peek()?.type === '-') {
      position += 1
      return -parseUnary()
    }
    return parsePower()
  }
  const parsePower = () => {
    let value = parsePostfix()
    if (peek()?.type === '^') {
      position += 1
      value **= parseUnary()
    }
    return value
  }
  const parsePostfix = () => {
    let value = parsePrimary()
    while (peek()?.type === '!' || peek()?.type === '%') {
      const operator = tokens[position++].type
      value = operator === '!' ? factorial(value) : value / 100
    }
    return value
  }
  const parsePrimary = () => {
    const token = peek()
    if (!token) throw new Error('Incomplete expression.')
    if (token.type === 'number') {
      position += 1
      return token.value
    }
    if (token.type === '(') {
      position += 1
      const value = parseExpression()
      consume(')')
      return value
    }
    if (token.type === 'name') {
      position += 1
      if (token.value === 'π' || token.value === 'pi') return Math.PI
      if (token.value === 'e') return Math.E
      if (token.value === 'ans') return answer
      const fn = FUNCTIONS[token.value]
      if (!fn) throw new Error(`Unknown function: ${token.value}`)
      const argumentsList = []
      if (peek()?.type === '(') {
        position += 1
        argumentsList.push(parseExpression())
        while (peek()?.type === ',') {
          position += 1
          argumentsList.push(parseExpression())
        }
        consume(')')
      } else {
        argumentsList.push(parseUnary())
      }
      return ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].includes(token.value)
        ? fn(...argumentsList, isRadianMode)
        : fn(...argumentsList)
    }
    throw new Error('Expected a number or expression.')
  }

  if (!tokens.length) throw new Error('Expression is empty.')
  const result = parseExpression()
  if (position < tokens.length) throw new Error(`Unexpected token: ${tokens[position].value}`)
  if (!Number.isFinite(result)) throw new Error('Result is not finite.')
  return result
}
