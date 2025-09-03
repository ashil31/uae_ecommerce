import React from 'react';
import { Slider } from './slider'; 

const PriceRangeSlider = ({ value, onChange, min, max, step }) => {
  const [localMin, localMax] = value || [min, max];

  const handleMinChange = (e) => {
    const newMin = Math.max(min, Math.min(Number(e.target.value), localMax - step));
    onChange([newMin, localMax]);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.min(max, Math.max(Number(e.target.value), localMin + step));
    onChange([localMin, newMax]);
  };

  return (
    <div className="space-y-4">
      <Slider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex items-center justify-between gap-4">
        {/* Min Value Input */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            AED
          </span>
          <input
            type="number"
            value={localMin}
            onChange={handleMinChange}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-2 text-center text-sm text-gray-800 shadow-sm focus:border-black focus:ring-1 focus:ring-black"
            min={min}
            max={localMax - step}
          />
        </div>
        
        <div className="h-0.5 w-4 bg-gray-300"></div>

        {/* Max Value Input */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            AED
          </span>
          <input
            type="number"
            value={localMax}
            onChange={handleMaxChange}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-2 text-center text-sm text-gray-800 shadow-sm focus:border-black focus:ring-1 focus:ring-black"
            min={localMin + step}
            max={max}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;