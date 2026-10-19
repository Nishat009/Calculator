function Display({ expression, result }) {
  return (
    <div className="calculator-display" aria-live="polite">
      <div className="expression-line">{expression || 'Ready for your next calculation'}</div>
      <div className={`result-line ${result === 'Error' ? 'error' : ''}`}>
        <span className="result-equals">=</span>
        <span>{result || '...'}</span>
      </div>
    </div>
  )
}

export default Display
