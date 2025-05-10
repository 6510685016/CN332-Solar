import { useState, useEffect } from 'react';

export default function ZoneGrid({ 
  width = 10, 
  height = 10, 
  zoneData = null, 
  containerHeight = 400,
  editable = false,
  onUpdateSolarPanels = () => {}
}) {
  // Parse position string to get column and row
  const parsePosition = (posStr) => {
    const matches = posStr.match(/Column: (\d+), Row: (\d+)/);
    if (!matches) return { col: 0, row: 0 };
    return { col: parseInt(matches[1]), row: parseInt(matches[2]) };
  };

  // Format date to local date string
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  // State for grid data
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    efficiency: 100,
    lastMaintenance: new Date().toISOString().split('T')[0]
  });
  const [hasChanges, setHasChanges] = useState(false);
  
  const cellSize = 60; // Fixed cell size in pixels

  // Process the zone data when it changes
  useEffect(() => {
    if (!zoneData || !zoneData.zoneObj || !zoneData.zoneObj.solarCellPanel) {
      // Create default grid if no data
      const defaultGrid = Array(height).fill().map((_, rowIndex) => 
        Array(width).fill().map((_, colIndex) => ({
          color: 'green',
          position: `Column: ${colIndex}, Row: ${rowIndex}`,
          efficiency: 100,
          lastMaintenance: new Date().toISOString(),
          originalIndex: -1 // No matching index in original data
        }))
      );
      setGridData(defaultGrid);
      return;
    }
    
    // Keep a reference to the original data
    setOriginalData(zoneData);
    
    // Initialize empty grid
    const newGrid = Array(height).fill().map(() => Array(width).fill(null));
    
    // Fill grid with data from the API
    zoneData.zoneObj.solarCellPanel.forEach((panel, index) => {
      const { col, row } = parsePosition(panel.position);
      
      // Skip if position is out of bounds
      if (row >= height || col >= width) return;
      
      // Set cell color based on efficiency
      let color = 'green';
      if (panel.efficiency < 70) color = 'red';
      else if (panel.efficiency < 90) color = 'orange';
      
      newGrid[row][col] = {
        color,
        position: panel.position,
        efficiency: panel.efficiency,
        lastMaintenance: panel.lastMaintenance,
        originalIndex: index // Keep track of the index in the original data array
      };
    });
    
    // Fill any empty cells with defaults
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (!newGrid[row][col]) {
          newGrid[row][col] = {
            color: 'gray', // Unknown status
            position: `Column: ${col}, Row: ${row}`,
            efficiency: 0,
            lastMaintenance: '',
            originalIndex: -1 // No matching index in original data
          };
        }
      }
    }
    
    setGridData(newGrid);
    setHasChanges(false);
  }, [zoneData, width, height]);

  const handleCellClick = (rowIndex, colIndex) => {
    const cell = gridData[rowIndex][colIndex];
    setSelectedCell(cell);
    setIsEditing(false);
    setEditValues({
      efficiency: cell.efficiency,
      lastMaintenance: cell.lastMaintenance ? 
        new Date(cell.lastMaintenance).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0]
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: name === 'efficiency' ? Number(value) : value
    });
  };

  const handleSaveCellEdit = () => {
    if (!selectedCell) return;
    
    // Find the cell coordinates
    const { col, row } = parsePosition(selectedCell.position);
    
    // Update the grid locally
    const newGridData = [...gridData];
    let color = 'green';
    if (editValues.efficiency < 70) color = 'red';
    else if (editValues.efficiency < 90) color = 'orange';
    
    newGridData[row][col] = {
      ...selectedCell,
      color,
      efficiency: editValues.efficiency,
      lastMaintenance: new Date(editValues.lastMaintenance).toISOString()
    };
    
    setGridData(newGridData);
    setSelectedCell(newGridData[row][col]);
    setIsEditing(false);
    setHasChanges(true);
  };

  const handleSaveAllChanges = () => {
    if (!originalData || !hasChanges) return;
    
    // Create a copy of the original solar panel array
    let updatedPanels = [...originalData.zoneObj.solarCellPanel];

    // Update panels based on the current grid data
    gridData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.originalIndex >= 0) {
          // Update existing panel
          updatedPanels[cell.originalIndex] = {
            ...updatedPanels[cell.originalIndex],
            efficiency: cell.efficiency,
            lastMaintenance: cell.lastMaintenance
          };
        }
      });
    });
    onUpdateSolarPanels(updatedPanels);
    setHasChanges(false);
  };

  return (
    <div className="zone-grid">
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
        <div
          className="grid"
          style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
            gap: '2px',
          }}
        >
          {gridData.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
                style={{ 
                  backgroundColor: cell?.color || 'gray',
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {colIndex},{rowIndex}
              </div>
            ))
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        <h3 style={{ margin: 0 }}>Solar Cell Information</h3>
        {hasChanges && (
          <button 
            onClick={handleSaveAllChanges}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Save All Changes
          </button>
        )}
      </div>

      {selectedCell && !isEditing && (
        <div 
          className="cell-info"
          style={{ 
            marginTop: '10px',
            width: '100%',
            border: '1px solid black',
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <p><strong>Position:</strong> {selectedCell.position}</p>
          <p><strong>Efficiency:</strong> {selectedCell.efficiency}%</p>
          <p><strong>Last Maintenance:</strong> {formatDate(selectedCell.lastMaintenance)}</p>
          {editable && (
            <>
              <button 
                onClick={handleEditClick}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </>
          )}
        </div>
      )}

      {selectedCell && isEditing && (
        <div 
          className="cell-edit"
          style={{ 
            marginTop: '10px',
            width: '100%',
            border: '1px solid black',
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <p><strong>Position:</strong> {selectedCell.position}</p>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Efficiency (%):
              <input
                type="number"
                name="efficiency"
                value={editValues.efficiency}
                onChange={handleInputChange}
                min="0"
                max="100"
                style={{ 
                  width: '100%', 
                  padding: '5px',
                  marginTop: '3px'
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Last Maintenance Date:
              <input
                type="date"
                name="lastMaintenance"
                value={editValues.lastMaintenance}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '5px',
                  marginTop: '3px'
                }}
              />
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleSaveCellEdit}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
            <button 
              onClick={handleCancelEdit}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}