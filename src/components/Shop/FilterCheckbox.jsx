import React from 'react';
import { FiCheck } from 'react-icons/fi';

const FilterCheckbox = ({ label, isChecked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <input type="checkbox" checked={isChecked} onChange={onChange} className="sr-only" />
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
      isChecked
        ? 'bg-black border-black'
        : 'bg-transparent border-gray-300 group-hover:border-gray-500'
    }`}>
      {isChecked && <FiCheck className="text-white" size={14} strokeWidth={3} />}
    </div>
    <span className={`text-sm transition-colors duration-200 ${
      isChecked ? 'text-black font-semibold' : 'text-gray-600 group-hover:text-black'
    }`}>
      {label}
    </span>
  </label>
);

export default FilterCheckbox;