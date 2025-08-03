import { useState } from 'react';
import useResultManager from '../Components/ResultManager';
import useExpressionManager from '../Components/ExpressionManager';

function useCalculatorLogic() {
  const { expression, setExpression, inputDigit: exprInputDigit, inputDecimal: exprInputDecimal, clear: clearExpression, clearEntry, performOperation: exprPerformOperation, handleEquals, toggleRadianMode } = useExpressionManager();
  const { result, setResult, handleScientificFunction, calculate } = useResultManager();

  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [isRadianMode, setIsRadianMode] = useState(true); // Default to RAD mode

  const inputDigit = (digit) => {
    if (waitingForSecondOperand && operator) {
      exprInputDigit(digit, `${firstOperand} ${operator}`);
      setResult(digit);
      setWaitingForSecondOperand(false);
    } else {
      exprInputDigit(digit, expression);
      setResult(result === '0' || !result ? digit : result + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand && operator) {
      exprInputDecimal(`${firstOperand} ${operator} 0.`);
      setResult('0.');
      setWaitingForSecondOperand(false);
    } else {
      exprInputDecimal(expression);
      setResult(!result.includes('.') ? result + '.' : result);
    }
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(result) || 0;
    if (firstOperand === null) {
      setFirstOperand(inputValue);
      exprPerformOperation(expression, nextOperator);
    } else if (operator) {
      const newResult = calculate(firstOperand, inputValue, operator);
      exprPerformOperation(`${firstOperand} ${operator} ${inputValue}`, nextOperator);
      setResult(String(newResult));
      setFirstOperand(newResult);
    }
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const handleScientificFunctionWrapper = (func) => {
    if (func === 'π') {
      setResult(String(Math.PI));
      setExpression('π');
    } else if (func === 'e') {
      setResult(String(Math.E));
      setExpression('e');
    } else {
      handleScientificFunction(func, result, isRadianMode);
      setExpression(`${func}(${result})`);
    }
    setWaitingForSecondOperand(false);
  };

  const handleEqualsWrapper = () => {
    if (operator && firstOperand !== null) {
      const inputValue = parseFloat(result) || 0;
      const newResult = calculate(firstOperand, inputValue, operator);
      handleEquals(`${firstOperand} ${operator} ${inputValue}`);
      setResult(String(newResult));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const toggleRadianModeWrapper = () => {
    setIsRadianMode(!isRadianMode);
    toggleRadianMode(expression, !isRadianMode);
    setResult('0');
    setWaitingForSecondOperand(false);
  };

  const clear = () => {
    clearExpression(); // Clears expression state
    setResult('0'); // Resets result state
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return {
    expression,
    result,
    inputDigit,
    inputDecimal,
    clear,
    clearEntry,
    performOperation,
    handleScientificFunction: handleScientificFunctionWrapper,
    handleEquals: handleEqualsWrapper,
    toggleRadianMode: toggleRadianModeWrapper
  };
}

export default useCalculatorLogic;