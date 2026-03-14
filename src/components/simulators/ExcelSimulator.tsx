import React, { useState, useEffect } from 'react';

interface ExcelSimulatorProps {
  value: string[][];
  onChange: (value: string[][]) => void;
}

export const ExcelSimulator: React.FC<ExcelSimulatorProps> = ({ value, onChange }) => {
  const rows = 10;
  const cols = 6;

  // Initialize with empty grid if value is empty or invalid
  const [grid, setGrid] = useState<string[][]>(() => {
    if (value && value.length === rows && value[0].length === cols) {
      return value;
    }
    return Array(rows).fill(null).map(() => Array(cols).fill(''));
  });

  useEffect(() => {
    onChange(grid);
  }, [grid, onChange]);

  const handleChange = (r: number, c: number, val: string) => {
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = val;
    setGrid(newGrid);
  };

  const getColLabel = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="border rounded-md overflow-x-auto h-64 bg-white">
      <div className="bg-slate-100 border-b p-2 flex items-center text-sm font-medium text-slate-700">
        <span className="mr-4">Formula Bar:</span>
        <input 
          type="text" 
          className="flex-1 border rounded px-2 py-1 bg-white" 
          placeholder="e.g. =SUM(B2:B5)"
        />
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-slate-300 bg-slate-100 w-10"></th>
            {Array(cols).fill(null).map((_, i) => (
              <th key={i} className="border border-slate-300 bg-slate-100 px-2 py-1 font-normal text-slate-600 w-24">
                {getColLabel(i)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, rIndex) => (
            <tr key={rIndex}>
              <td className="border border-slate-300 bg-slate-100 text-center text-slate-500 font-medium">
                {rIndex + 1}
              </td>
              {row.map((cell, cIndex) => (
                <td key={cIndex} className="border border-slate-200 p-0">
                  <input
                    type="text"
                    className="w-full h-full px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 relative"
                    value={cell}
                    onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
