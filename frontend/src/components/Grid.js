import React, { useState, useEffect } from 'react';

const Grid = ({ grid, setGrid, onGridComplete }) => {
  const [error, setError] = useState('');

  const handleInputChange = (rowIndex, colIndex, value) => {
    const numValue = parseInt(value, 10);

    if (isNaN(numValue) || numValue < 1 || numValue > 9) {
      setError('Please enter a number between 1 and 9');
      return;
    }

    const isDuplicate = grid.some(row => row.includes(numValue));
    if (isDuplicate) {
      setError('Duplicate numbers are not allowed in the grid');
      return;
    }

    const newGrid = grid.map((row, rIndex) =>
      row.map((num, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? numValue : num
      )
    );

    setGrid(newGrid);
    setError('');

    const isComplete = newGrid.every(row => row.every(num => num !== null));
    if (isComplete) {
      onGridComplete();  // Trigger grid completion callback
    }
  };

  return (
    <div>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((num, colIndex) => (
            <input
              key={colIndex}
              type="number"
              value={num !== null ? num : ''}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              className="grid-input"
              min="1"
              max="9"
            />
          ))}
        </div>
      ))}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Grid;
