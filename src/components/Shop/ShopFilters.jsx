import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiX, FiCheck, FiChevronDown } from "react-icons/fi"; // Added icons
import { motion, AnimatePresence } from "framer-motion"; // Added for animations
import { setFilters, clearFilters } from "../../store/slices/productsSlice";
import { Slider } from "../uis/slider";

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

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="py-4 border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-semibold text-gray-800"
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', marginTop: '16px' },
              collapsed: { opacity: 0, height: 0, marginTop: '0px' },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main ShopFilters Component ---

const ShopFilters = forwardRef(({ isOpen, onClose, filterOptions = {}, onApplyFilters }, ref) => {
  // --- ALL YOUR ORIGINAL LOGIC IS PRESERVED ---
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { filters } = useSelector((state) => state.products);
  const { isRTL } = useSelector((state) => state.ui);

  const [localFilters, setLocalFilters] = useState({
    priceRange: filters?.priceRange || [0, 1000],
    colors: filters?.colors || [],
    sizes: filters?.sizes || [],
    brands: filters?.brands || [],
    fabrics: filters?.fabrics || [],
    category: filters?.category || "",
    subcategory: filters?.subcategory || "",
  });

  useEffect(() => {
    setLocalFilters({
      priceRange: filters?.priceRange || [0, 10000],
      colors: filters?.colors || [],
      sizes: filters?.sizes || [],
      brands: filters?.brands || [],
      fabrics: filters?.fabrics || [],
      category: filters?.category || "",
      subcategory: filters?.subcategory || "",
    });
  }, [filters]);

  useImperativeHandle(ref, () => ({
    applyFilters: () => {
      dispatch(setFilters(localFilters));
      if (onApplyFilters) onApplyFilters(localFilters);
    },
    resetFilters: () => {
      dispatch(clearFilters());
      setLocalFilters({
        priceRange: [0, 10000], colors: [], sizes: [], brands: [], fabrics: [], category: "", subcategory: "",
      });
    }
  }), [localFilters, dispatch, onApplyFilters]);

  const safeFilterOptions = {
    brands: filterOptions.brands || [],
    colors: filterOptions.colors || [],
    sizes: filterOptions.sizes || [],
    fabrics: filterOptions.fabrics || [],
    categories: filterOptions.categories || [],
    subcategories: filterOptions.subcategories || [],
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "priceRange") {
      setLocalFilters((prev) => ({ ...prev, [filterType]: value }));
    } else if (filterType === "category") {
      setLocalFilters((prev) => ({ ...prev, category: value, subcategory: "" }));
    } else if (filterType === "subcategory") {
      setLocalFilters((prev) => ({ ...prev, subcategory: value }));
    } else {
      setLocalFilters((prev) => {
        const currentValues = prev[filterType] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [filterType]: newValues };
      });
    }
  };

  const isFilterActive = (type, value) => {
    if (!localFilters[type]) return false;
    return localFilters[type].includes(value);
  };

  // --- UPDATED UI RENDERING ---
  return (
    <div className={`flex flex-col h-full bg-white z-50 ${isOpen ? "block" : "hidden"}`}>
      {/* <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        <button onClick={onClose} className="p-2 lg:hidden">
          <FiX size={24} />
        </button>
      </div> */}

      <div className="flex-1 overflow-y-auto px-4">
        <FilterSection title="Category" defaultOpen={true}>
          <div className="space-y-1">
            {/* All Categories Button */}
            <button onClick={() => handleFilterChange("category", "")} className={`w-full text-left text-sm p-2 rounded transition-colors ${!localFilters.category ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}>
              All Categories
            </button>
            {/* Category Buttons */}
            {safeFilterOptions.categories.map((category) => (
              <div key={category}>
                <button
                  onClick={() => handleFilterChange("category", category)}
                  className={`w-full text-left text-sm p-2 rounded transition-colors ${localFilters.category === category ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  {category}
                </button>
                {/* Subcategories */}
                {localFilters.category === category && safeFilterOptions.subcategories.length > 0 && (
                  <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-200 ml-2">
                     <button onClick={() => handleFilterChange("subcategory", "")} className={`w-full text-left text-xs p-2 rounded transition-colors ${!localFilters.subcategory ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}>
                      All Subcategories
                    </button>
                    {safeFilterOptions.subcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => handleFilterChange("subcategory", sub)}
                        className={`w-full text-left text-xs p-2 rounded transition-colors ${localFilters.subcategory === sub ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price Range (AED)" defaultOpen={true} >
          <Slider value={localFilters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)} min={0} max={10000} step={1} className="w-full mt-2" />
          <div className="flex justify-between text-sm  text-gray-500 mt-2">
            <span>{localFilters.priceRange[0]}</span>
            <span>{localFilters.priceRange[1]}</span>
          </div>
        </FilterSection>

        <FilterSection title="Brands">
          <div className="space-y-3">
            {safeFilterOptions.brands.map((brand) => (
              <FilterCheckbox key={brand} label={brand} isChecked={isFilterActive("brands", brand)} onChange={() => handleFilterChange("brands", brand)} />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Materials">
          <div className="space-y-3">
            {safeFilterOptions.fabrics.map((fabric) => (
              <FilterCheckbox key={fabric} label={fabric} isChecked={isFilterActive("fabrics", fabric)} onChange={() => handleFilterChange("fabrics", fabric)} />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Colors">
          <div className="flex flex-wrap gap-3">
            {safeFilterOptions.colors.map((color) => (
              <button
                key={color}
                onClick={() => handleFilterChange("colors", color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 transform hover:scale-110 ${ isFilterActive("colors", color) ? 'border-black ring-2 ring-offset-1 ring-black' : 'border-gray-200' }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Sizes">
          <div className="flex flex-wrap gap-2">
            {safeFilterOptions.sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleFilterChange("sizes", size)}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold transition-colors duration-200 ${ isFilterActive("sizes", size) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100' }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
      
      {/* Buttons (Preserved logic to call ref) */}
      {/* <div className="p-4 border-t bg-white space-y-2 sticky bottom-0">
        <button onClick={() => ref.current?.applyFilters()} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
          {t("shop.applyFilters") || "Apply"}
        </button>
        <button onClick={() => ref.current?.resetFilters()} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
          {t("shop.clearFilters") || "Reset"}
        </button>
      </div> */}
    </div>
  );
});

ShopFilters.displayName = 'ShopFilters';

export default ShopFilters;