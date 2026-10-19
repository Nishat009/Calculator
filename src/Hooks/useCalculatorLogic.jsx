import { useCallback, useEffect, useState } from 'react'
import { evaluateExpression } from '../Components/scientificMath'

const HISTORY_KEY = 'scientific-calculator-history'

function formatResult(value) {
  if (!Number.isFinite(value)) return 'Error'
  if (Object.is(value, -0)) return '0'
  return Number(value.toPrecision(12)).toString()
}

function useCalculatorLogic() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [isRadianMode, setIsRadianMode] = useState(true)
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
      return Array.isArray(saved) ? saved : []
    } catch (error) {
      console.error('Could not load calculator history.', error)
      return []
    }
  })
  const [justEvaluated, setJustEvaluated] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Could not save calculator history.', error)
    }
  }, [history])

  const updateExpression = useCallback((nextExpression) => {
    setExpression(nextExpression)
    setJustEvaluated(false)
    if (!nextExpression.trim()) {
      setResult('0')
      return
    }
    try {
      setResult(formatResult(evaluateExpression(nextExpression, isRadianMode, Number(result) || 0)))
    } catch {
      setResult('')
    }
  }, [isRadianMode, result])

  const inputDigit = useCallback((digit) => {
    const current = justEvaluated ? '' : expression
    updateExpression(`${current}${digit}`)
  }, [expression, justEvaluated, updateExpression])

  const inputDecimal = useCallback(() => {
    const current = justEvaluated ? '' : expression
    const currentNumber = current.split(/[+\-×÷^()%]/).pop() || ''
    if (!currentNumber.includes('.')) updateExpression(`${current}${currentNumber ? '.' : '0.'}`)
  }, [expression, justEvaluated, updateExpression])

  const performOperation = useCallback((operator) => {
    const current = justEvaluated ? result : expression
    if (!current) {
      if (operator === '-') updateExpression('-')
      return
    }
    const trimmed = current.trim()
    if (trimmed.endsWith('mod') || /[+\-×÷^]$/.test(trimmed)) {
      updateExpression(`${trimmed.slice(0, trimmed.endsWith('mod') ? -3 : -1)}${operator}`)
    } else {
      updateExpression(`${current}${operator}`)
    }
  }, [expression, justEvaluated, result, updateExpression])

  const handleScientificFunction = useCallback((func) => {
    const names = {
      'x^2': 'sqr', 'x^3': 'cube', '1/x': 'inv', 'x!': 'fact',
      '√x': 'sqrt', '10^x': 'pow10', 'π': 'pi',
    }
    const current = justEvaluated ? result : expression
    if (func === 'pi' || func === 'e') {
      updateExpression(`${current && !/[+\-×÷^(]$/.test(current) ? `${current}×` : current}${func === 'pi' ? 'π' : 'e'}`)
      return
    }
    const functionName = names[func] || func
    if (!current || /[+\-×÷^(]$/.test(current.trim())) {
      updateExpression(`${current}${functionName}(`)
      return
    }
    updateExpression(`${functionName}(${current})`)
  }, [expression, justEvaluated, result, updateExpression])

  const handleEquals = useCallback(() => {
    try {
      const value = evaluateExpression(expression, isRadianMode, Number(result) || 0)
      const formatted = formatResult(value)
      setResult(formatted)
      setHistory((items) => [{ expression, result: formatted, id: `${Date.now()}-${Math.random()}` }, ...items].slice(0, 30))
      setJustEvaluated(true)
    } catch {
      setResult('Error')
      setJustEvaluated(true)
    }
  }, [expression, isRadianMode, result])

  const clear = useCallback(() => {
    setExpression('')
    setResult('0')
    setJustEvaluated(false)
  }, [])

  const clearEntry = useCallback(() => {
    if (justEvaluated) {
      clear()
      return
    }
    const next = expression.replace(/(?:\d+\.?\d*|\.\d+|π|e|Ans)\s*$/, '')
    updateExpression(next)
  }, [clear, expression, justEvaluated, updateExpression])

  const backspace = useCallback(() => {
    if (justEvaluated) {
      clear()
      return
    }
    updateExpression(expression.slice(0, -1))
  }, [clear, expression, justEvaluated, updateExpression])

  const toggleRadianMode = useCallback(() => {
    const nextMode = !isRadianMode
    setIsRadianMode(nextMode)
    if (expression) {
      try {
        setResult(formatResult(evaluateExpression(expression, nextMode, Number(result) || 0)))
      } catch {
        setResult('')
      }
    }
  }, [expression, isRadianMode, result])

  const inputToken = useCallback((token) => {
    const current = justEvaluated ? '' : expression
    updateExpression(`${current}${token}`)
  }, [expression, justEvaluated, updateExpression])

  const setExpressionFromHistory = useCallback((item) => updateExpression(item.expression), [updateExpression])
  const clearHistory = useCallback(() => setHistory([]), [])

  const memoryAction = useCallback((action) => {
    const value = Number(result)
    if (action === 'MC') setMemory(0)
    if (action === 'MR') updateExpression(String(memory))
    if (action === 'MS') setMemory(Number.isFinite(value) ? value : 0)
    if (action === 'M+') setMemory((stored) => stored + (Number.isFinite(value) ? value : 0))
    if (action === 'M-') setMemory((stored) => stored - (Number.isFinite(value) ? value : 0))
  }, [memory, result, updateExpression])

  return {
    expression, result, isRadianMode, memory, history,
    inputDigit, inputDecimal, inputToken, clear, clearEntry, backspace,
    performOperation, handleScientificFunction, handleEquals,
    toggleRadianMode, setExpressionFromHistory, clearHistory, memoryAction,
  }
}

export default useCalculatorLogic
