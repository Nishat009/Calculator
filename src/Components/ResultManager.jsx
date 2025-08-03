import { useState } from 'react';

function useResultManager() {
  const [result, setResult] = useState('0');

  const handleScientificFunction = (func, currentResult, isRadianMode) => {
    const inputValue = parseFloat(currentResult) || 0; // Avoid NaN on empty input
    let newResult;
    switch (func) {
      case 'sqrt': newResult = Math.sqrt(inputValue); break;
      case 'sin': newResult = isRadianMode ? Math.sin(inputValue) : Math.sin(inputValue * Math.PI / 180); break;
      case 'cos': newResult = isRadianMode ? Math.cos(inputValue) : Math.cos(inputValue * Math.PI / 180); break;
      case 'tan': newResult = isRadianMode ? Math.tan(inputValue) : Math.tan(inputValue * Math.PI / 180); break;
      case 'log': newResult = Math.log10(inputValue > 0 ? inputValue : 1); break; // Prevent log of 0 or negative
      case 'ln': newResult = Math.log(inputValue > 0 ? inputValue : 1); break;
      case 'x^2': newResult = Math.pow(inputValue, 2); break;
      case 'x^3': newResult = Math.pow(inputValue, 3); break;
      case '1/x': newResult = inputValue !== 0 ? 1 / inputValue : 'Error'; break;
      case 'x!': newResult = factorial(Math.floor(inputValue >= 0 ? inputValue : 0)); break;
      case 'exp': newResult = Math.exp(inputValue); break;
      case 'abs': newResult = Math.abs(inputValue); break;
      default: newResult = inputValue;
    }
    setResult(isNaN(newResult) ? 'Error' : String(newResult));
  };

  const calculate = (first, second, op) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': return second !== 0 ? first / second : 'Error';
      case '^': return Math.pow(first, second);
      case '%': return (first * second) / 100;
      default: return second;
    }
  };

  const factorial = (n) => {
    if (n > 170) return 'Infinity'; // Prevent stack overflow for large numbers
    if (n < 0) return 'Error';
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  return { result, setResult, handleScientificFunction, calculate };
}

export default useResultManager;