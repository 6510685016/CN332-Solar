import { useState } from 'react';

export default function ZoneGrid({ width = 10, height = 10, gridData = [], containerHeight = 400 }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const cellSize = 60; // Fixed cell size in pixels

  // Generate default data if none provided
  const data = gridData.length > 0 ? gridData : Array(height).fill().map((_, rowIndex) => 
    Array(width).fill().map((_, colIndex) => ({
      color: 'green',
      value: `แผง ${rowIndex}-${colIndex}`,
      details: `ซ้อมเมื่อ 1/1/2222`
    }))
  );

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell(data[rowIndex][colIndex]);
  };

  return (
    <div className="zone-grid">
      {/* Fixed size container with borders and scrolling */}
      <div 
        className="grid-section"
        style={{ 
          width: '100%',
          height: `${containerHeight}px`,
          border: '1px solid black',
          borderRadius: '15px',
          padding: '5px',
          overflow: 'auto',
        }}
      >
        {/* Grid with fixed size cells */}
        <div
          className="grid"
          style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
            gap: '2px',
          }}
        >
          {data.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
                style={{ 
                  backgroundColor: cell.color,
                  width: `${cellSize}px`,
                  height: `${cellSize}px`
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
              </div>
            ))
          ))}
        </div>
      </div>

      {selectedCell && (
        <div 
            className="cell-info"
            style={{ 
                marginTop: '10px',
                width: '100%',
                textAlign: 'center',
                border: '1px solid black',
                padding: '5px',
                // borderRadius: '15px'
            }}
        >
          <h3>Solar Cell Information</h3>
          <p>{selectedCell.value}</p>
          <p>{selectedCell.details}</p>
        </div>
      )}
    </div>
  );
}