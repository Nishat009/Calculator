function Button({ label, onClick, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`calculator-button ${tone}`}
      aria-label={label}
    >
      {label}
    </button>
  )
}

export default Button
