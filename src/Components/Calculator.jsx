
import useCalculatorLogic from '../Hooks/useCalculatorLogic';
import Button from './Button';
import Display from './Display';

function Calculator() {
  const {
    expression,
    result,
    inputDigit,
    inputDecimal,
    clear,
    clearEntry,
    performOperation,
    handleScientificFunction,
    handleEquals,
    toggleRadianMode
  } = useCalculatorLogic();

  const buttons = [
    { label: 'AC', action: clear, style: 'bg-red-500 hover:bg-red-600' },
    { label: 'CE', action: clearEntry, style: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'RAD', action: toggleRadianMode, style: 'bg-indigo-500 hover:bg-indigo-600' },
    { label: 'sin', action: () => handleScientificFunction('sin'), style: 'bg-teal-500 hover:bg-teal-600' },
    { label: 'cos', action: () => handleScientificFunction('cos'), style: 'bg-teal-500 hover:bg-teal-600' },
    { label: 'tan', action: () => handleScientificFunction('tan'), style: 'bg-teal-500 hover:bg-teal-600' },
    { label: 'log', action: () => handleScientificFunction('log'), style: 'bg-sky-500 hover:bg-sky-600' },
    { label: 'ln', action: () => handleScientificFunction('ln'), style: 'bg-sky-500 hover:bg-sky-600' },
    { label: '√x', action: () => handleScientificFunction('sqrt'), style: 'bg-pink-500 hover:bg-pink-600' },
    { label: 'x^y', action: () => performOperation('^'), style: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'exp', action: () => handleScientificFunction('exp'), style: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'x^2', action: () => handleScientificFunction('x^2'), style: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'x^3', action: () => handleScientificFunction('x^3'), style: 'bg-purple-500 hover:bg-purple-600' },
    { label: '1/x', action: () => handleScientificFunction('1/x'), style: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: 'x!', action: () => handleScientificFunction('x!'), style: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: 'π', action: () => { handleScientificFunction('π'); inputDigit(String(Math.PI)); }, style: 'bg-green-500 hover:bg-green-600' }, // Fixed
    { label: 'e', action: () => { handleScientificFunction('e'); inputDigit(String(Math.E)); }, style: 'bg-green-500 hover:bg-green-600' }, // Fixed
    { label: '|x|', action: () => handleScientificFunction('abs'), style: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: '%', action: () => performOperation('%'), style: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: '÷', action: () => performOperation('÷'), style: 'bg-blue-500 hover:bg-blue-600' },
    { label: '7', action: () => inputDigit('7'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '8', action: () => inputDigit('8'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '9', action: () => inputDigit('9'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '-', action: () => performOperation('-'), style: 'bg-teal-500 hover:bg-teal-600' },
    { label: '×', action: () => performOperation('×'), style: 'bg-blue-500 hover:bg-blue-600' },
    { label: '4', action: () => inputDigit('4'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '5', action: () => inputDigit('5'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '6', action: () => inputDigit('6'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '+', action: () => performOperation('+'), style: 'bg-red-500 hover:bg-red-600' },
    { label: '=', action: handleEquals, style: 'bg-purple-500 hover:bg-purple-600' },
    { label: '1', action: () => inputDigit('1'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '2', action: () => inputDigit('2'), style: 'bg-gray-700 hover:bg-gray-800' },
    { label: '3', action: () => inputDigit('3'), style: 'bg-gray-700 hover:bg-gray-800' },
    
    { label: '0', action: () => inputDigit('0'), style: 'bg-gray-700 hover:bg-gray-800 col-span-1' },
    { label: '.', action: inputDecimal, style: 'bg-blue-500 hover:bg-blue-600' },
  ];

  return (
    <div className="w-96 bg-gray-900 rounded-lg shadow-lg p-4">
      <Display expression={expression} result={result} />
      <div className="grid grid-cols-5 gap-2">
        {buttons.map((button, index) => (
          <Button
            key={index}
            label={button.label}
            onClick={button.action}
            style={button.style}
          />
        ))}
      </div>
    </div>
  );
}

export default Calculator;