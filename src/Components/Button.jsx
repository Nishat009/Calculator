function Button({ label, onClick, style }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 text-white rounded-lg ${style} transition-colors`}
    >
      {label}
    </button>
  );
}

export default Button;