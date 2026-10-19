import { useEffect } from 'react'
import useCalculatorLogic from '../Hooks/useCalculatorLogic'
import Button from './Button'
import Display from './Display'

const buttonRows = [
  [
    { label: 'sin', action: 'fn:sin', tone: 'function' },
    { label: 'cos', action: 'fn:cos', tone: 'function' },
    { label: 'tan', action: 'fn:tan', tone: 'function' },
    { label: 'sin⁻¹', action: 'fn:asin', tone: 'function' },
    { label: 'cos⁻¹', action: 'fn:acos', tone: 'function' },
    { label: 'tan⁻¹', action: 'fn:atan', tone: 'function' },
  ],
  [
    { label: 'sinh', action: 'fn:sinh', tone: 'function' },
    { label: 'cosh', action: 'fn:cosh', tone: 'function' },
    { label: 'tanh', action: 'fn:tanh', tone: 'function' },
    { label: 'ln', action: 'fn:ln', tone: 'function' },
    { label: 'log', action: 'fn:log', tone: 'function' },
    { label: 'log₂', action: 'fn:log2', tone: 'function' },
  ],
  [
    { label: '√', action: 'fn:sqrt', tone: 'function' },
    { label: '∛', action: 'fn:cbrt', tone: 'function' },
    { label: 'x²', action: 'fn:x^2', tone: 'function' },
    { label: 'xʸ', action: '^', tone: 'operator' },
    { label: 'n!', action: 'fn:x!', tone: 'function' },
    { label: '1/x', action: 'fn:1/x', tone: 'function' },
  ],
  [
    { label: '(', action: '(', tone: 'function' },
    { label: ')', action: ')', tone: 'function' },
    { label: 'π', action: 'fn:pi', tone: 'constant' },
    { label: 'e', action: 'fn:e', tone: 'constant' },
    { label: '⌫', action: 'backspace', tone: 'utility' },
    { label: 'AC', action: 'clear', tone: 'danger' },
  ],
  [
    { label: '7', action: '7', tone: 'digit' },
    { label: '8', action: '8', tone: 'digit' },
    { label: '9', action: '9', tone: 'digit' },
    { label: '÷', action: '÷', tone: 'operator' },
    { label: '%', action: '%', tone: 'operator' },
    { label: 'mod', action: 'mod', tone: 'operator' },
  ],
  [
    { label: '4', action: '4', tone: 'digit' },
    { label: '5', action: '5', tone: 'digit' },
    { label: '6', action: '6', tone: 'digit' },
    { label: '×', action: '×', tone: 'operator' },
    { label: 'x³', action: 'fn:x^3', tone: 'function' },
    { label: '|x|', action: 'fn:abs', tone: 'function' },
  ],
  [
    { label: '1', action: '1', tone: 'digit' },
    { label: '2', action: '2', tone: 'digit' },
    { label: '3', action: '3', tone: 'digit' },
    { label: '−', action: '-', tone: 'operator' },
    { label: 'exp', action: 'fn:exp', tone: 'function' },
    { label: '10ˣ', action: 'fn:10^x', tone: 'function' },
  ],
  [
    { label: '±', action: 'fn:neg', tone: 'utility' },
    { label: '0', action: '0', tone: 'digit' },
    { label: '.', action: '.', tone: 'digit' },
    { label: '+', action: '+', tone: 'operator' },
    { label: 'Ans', action: 'Ans', tone: 'constant' },
    { label: '=', action: '=', tone: 'equals' },
  ],
]

function Calculator() {
  const calculator = useCalculatorLogic()
  const {
    expression, result, isRadianMode, memory, history, inputDigit,
    inputDecimal, inputToken, clear, clearEntry, backspace,
    performOperation, handleScientificFunction, handleEquals,
    toggleRadianMode, setExpressionFromHistory, clearHistory, memoryAction,
  } = calculator

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (/^\d$/.test(event.key)) inputDigit(event.key)
      else if (event.key === '.') inputDecimal()
      else if (['+', '-', '^', '%'].includes(event.key)) performOperation(event.key)
      else if (event.key === '*') performOperation('×')
      else if (event.key === '/') {
        event.preventDefault()
        performOperation('÷')
      } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault()
        handleEquals()
      } else if (event.key === 'Backspace') backspace()
      else if (event.key === 'Escape') clear()
      else if (event.key === '(' || event.key === ')') inputToken(event.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [backspace, clear, handleEquals, inputDecimal, inputDigit, inputToken, performOperation])

  const onButtonClick = (action) => {
    if (action.startsWith('fn:')) handleScientificFunction(action.slice(3))
    else if (/^\d$/.test(action)) inputDigit(action)
    else if (action === '.') inputDecimal()
    else if (action === 'clear') clear()
    else if (action === 'backspace') backspace()
    else if (action === '=') handleEquals()
    else if (['+', '-', '×', '÷', '^', '%', 'mod'].includes(action)) performOperation(action)
    else inputToken(action)
  }

  return (
    <main className="calculator-layout">
      <section className="calculator-card" aria-label="Scientific calculator">
        <div className="calculator-topline">
          <div className="mode-switch" aria-label="Angle unit">
            <button className={!isRadianMode ? 'selected' : ''} onClick={() => isRadianMode && toggleRadianMode()}>DEG</button>
            <button className={isRadianMode ? 'selected' : ''} onClick={() => !isRadianMode && toggleRadianMode()}>RAD</button>
          </div>
          <div className="memory-label"><span className="memory-dot" /> {memory ? `M ${memory}` : 'MEMORY READY'}</div>
        </div>

        <Display expression={expression} result={result} />

        <div className="memory-row" aria-label="Memory controls">
          {['MC', 'MR', 'M+', 'M-', 'MS'].map((action) => (
            <button key={action} onClick={() => memoryAction(action)}>{action}</button>
          ))}
          <button className="clear-entry" onClick={clearEntry}>CE</button>
        </div>

        <div className="keypad">
          {buttonRows.flat().map((button) => (
            <Button
              key={button.label}
              label={button.label}
              onClick={() => onButtonClick(button.action)}
              tone={button.tone}
            />
          ))}
        </div>
        <p className="keyboard-hint">KEYBOARD READY <span>·</span> Press <kbd>Enter</kbd> to calculate</p>
      </section>

      <aside className="side-panel">
        <section className="history-card">
          <div className="panel-heading">
            <div><span className="eyebrow">YOUR WORKSPACE</span><h2>Recent calculations</h2></div>
            <button className="text-button" onClick={clearHistory} disabled={!history.length}>Clear</button>
          </div>
          {history.length ? (
            <div className="history-list">
              {history.map((item) => (
                <button className="history-item" key={item.id} onClick={() => setExpressionFromHistory(item)}>
                  <span>{item.expression}</span><strong>{item.result}</strong>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-history"><span className="history-icon">↗</span><p>Your calculations will show up here.</p><span>Start with any expression</span></div>
          )}
        </section>
        <section className="tips-card">
          <span className="eyebrow">QUICK TIP</span>
          <p>Use parentheses for complex expressions, like <code>sin(30) + √(16)</code>.</p>
          <div className="feature-pills"><span>Scientific</span><span>Keyboard support</span><span>History saved</span></div>
        </section>
      </aside>
    </main>
  )
}

export default Calculator
