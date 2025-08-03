function Display({ expression, result }) {
  return (
    <div className="bg-gray-800 text-white text-right p-4 rounded-lg mb-4">
      <div className="text-lg text-gray-400 mb-2">{expression || '0'}</div>
      <div className="text-2xl font-mono">{result}</div>
    </div>
  );
}

export default Display;