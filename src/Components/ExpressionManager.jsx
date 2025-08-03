import { useState } from 'react';

function useExpressionManager() {
  const [expression, setExpression] = useState('');

  const inputDigit = (digit, currentExpression = expression) => {
    setExpression(currentExpression === '0' || !currentExpression ? digit : currentExpression + digit);
  };

  const inputDecimal = (currentExpression = expression) => {
    if (!currentExpression.includes('.')) {
      setExpression(currentExpression + '.');
    }
  };

  const clear = () => {
    setExpression('');
  };

  const clearEntry = () => {
    setExpression('');
  };

  const performOperation = (currentExpression, nextOperator) => {
    setExpression(currentExpression.trim() + ` ${nextOperator} `);
  };

  const handleEquals = (currentExpression) => {
    setExpression(currentExpression.trim() + ' =');
  };

  const toggleRadianMode = (currentExpression, isRadianMode) => {
    setExpression(`Mode: ${isRadianMode ? 'DEG' : 'RAD'}`);
  };

  return { expression, setExpression, inputDigit, inputDecimal, clear, clearEntry, performOperation, handleEquals, toggleRadianMode };
}

export default useExpressionManager;