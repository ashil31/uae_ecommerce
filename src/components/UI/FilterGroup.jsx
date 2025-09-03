import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


// Added for Dropdown of Filters
const FilterGroup = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to open for better UX

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="border-b border-gray-200 pb-3 mb-4">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center text-sm font-semibold text-gray-800 py-3 hover:bg-gray-50 rounded-md px-2 transition-colors"
      >
        {title}
        {isOpen ? <IoIosArrowUp size={18} className="text-gray-600" /> : <IoIosArrowDown size={18} className="text-gray-600" />}
      </button>
      {isOpen && (
        <div className="pt-2 px-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterGroup;
