import React, { useState, useEffect } from 'react';

// Improved PriceRangeSlider Component
const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (index, newValue) => {
    const numValue = Math.max(min, Math.min(max, Number(newValue)));
    const newRange = [...localValue];
    newRange[index] = numValue;
    
    // Ensure min <= max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    setLocalValue(newRange);
    onChange(newRange);
  };

  const percentage = (value) => ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">${localValue[0]}</span>
        <span className="text-sm font-medium text-gray-700">${localValue[1]}</span>
      </div>
      
      <div className="relative h-2">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
        <div 
          className="absolute h-2 bg-gray-900 rounded-full"
          style={{
            left: `${percentage(localValue[0])}%`,
            width: `${percentage(localValue[1]) - percentage(localValue[0])}%`
          }}
        ></div>
        
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
          style={{
            background: 'transparent',
            WebkitAppearance: 'none',
            zIndex: 1
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
          style={{
            background: 'transparent',
            WebkitAppearance: 'none',
            zIndex: 2
          }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="number"
            value={localValue[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-[#f7f5f1] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Min"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="number"
            value={localValue[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-[#f7f5f1] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};


export default PriceRangeSlider;