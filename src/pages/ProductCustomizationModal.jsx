import React, { useState, useEffect } from "react";

const ProductCustomizationModal = ({
  isOpen,
  onClose,
  onSubmit,
  productName,
}) => {
  const initialOptions = {
    name: "",
    hasEmbroidery: false,
    fontStyle: "Script",
    threadColor: "Black",
  };

  // These hooks require `useState` and `useEffect` to be in scope.
  const [customization, setCustomization] = useState(initialOptions);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setCustomization(initialOptions), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomization((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(customization);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between border-b border-gray-200 pb-3">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Customize: {productName}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl font-light leading-none text-gray-400 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-2 block font-semibold text-gray-700"
            >
              Name on the Cloth
            </label>
            <input
              type="text"
              id="name"
              autoComplete="off"
              autoCapitalize="on"
              name="name"
              value={customization.name || ""}
              onChange={handleInputChange}
              placeholder="e.g., Rashid"
              maxLength="15"
              className="w-full bg-white  rounded-md border border-gray-300 px-4 py-2 text-gray-800 transition-shadow duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <label
              htmlFor="hasEmbroidery"
              className="font-semibold text-gray-700"
            >
              Add Embroidery (+100 AED)
            </label>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                id="hasEmbroidery"
                name="hasEmbroidery"
                checked={customization.hasEmbroidery}
                onChange={handleInputChange}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
          {customization.hasEmbroidery && (
            <div className="mt-4 space-y-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 overflow-hidden">
              
              {/* <div className="flex  items-center justify-center lg:block md:block gap-3 "> */}
              <div>
                <label
                  htmlFor="fontStyle"
                  className="mb-2 block font-semibold text-gray-700"
                >
                  Font Style
                </label>
                <select
                  id="fontStyle"
                  name="fontStyle"
                  value={customization.fontStyle || ""}
                  onChange={handleInputChange}
                  className="w-1/2
                sm:w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 transition-shadow duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option>Optima</option>
                  <option>Arabic</option>
                  <option>Serif</option>
                </select>
              </div>
              {/* <div className="flex  items-center justify-center lg:block md:block gap-3"> */}
              <div>
                <label
                  htmlFor="threadColor"
                  className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base"
                >
                  Thread Color
                </label>
                <select
                  id="threadColor"
                  name="threadColor"
                  value={customization.threadColor || ""}
                  onChange={handleInputChange}
                  className="block w-1/2 sm:w-full  rounded-md border border-gray-300 bg-white px-4 py-2
      text-sm sm:text-base text-gray-800 shadow-sm
      focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300
      transition duration-200 ease-in-out"
  >
                  <option>Black</option>
                  <option>White</option>
                  <option>Gold</option>
                  <option>Silver</option>
                  <option>Red</option>
                </select>
              </div>
            </div>
          )}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md bg-gray-200 px-6 py-2.5 font-semibold text-gray-800 transition-colors hover:bg-gray-300 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              Confirm & Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCustomizationModal;
