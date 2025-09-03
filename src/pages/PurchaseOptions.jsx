import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice'; // Adjust path as needed
import toast from 'react-hot-toast'; // Assuming you use react-hot-toast

// --- Helper Icon Component ---
const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

/**
 * A "smart" component that allows users to select between a combo product or its
 * individual parts and handles adding the selection to the cart directly.
 * @param {{
 * product: object;
 * onSelectionChange: (selectedProduct: object) => void;
 * }} props
 */
function PurchaseOptions({ product, onSelectionChange }) {
  const dispatch = useDispatch();
  const [selectedOptionId, setSelectedOptionId] = useState(product._id);

  // Memoize the list of all purchase options to prevent recalculating on every render.
  const purchaseOptions = useMemo(() => {
    if (product.productType === 'combo' && product.componentProducts?.length > 0) {
      return [
        { _id: product._id, name: `Full Set: ${product.name}`, price: product.price, images: product.images },
        ...product.componentProducts.map(p => ({ ...p, name: `Individual: ${p.name}` }))
      ];
    }
    return [product];
  }, [product]);

  // Find the full object for the currently selected product.
  const selectedProduct = useMemo(() => {
    const foundProduct = purchaseOptions.find(p => p._id === selectedOptionId);
    // Ensure a quantity of 1 is always part of the selected product object
    return foundProduct ? { ...foundProduct, quantity: 1 } : { ...product, quantity: 1 };
  }, [selectedOptionId, purchaseOptions, product]);

  // Effect to notify the parent component whenever the selection changes.
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedProduct);
    }
  }, [selectedProduct, onSelectionChange]);

  // Internal handler to dispatch the addToCart action.
  const handleAddToCartClick = () => {
    const payload = {
      productId: selectedProduct._id,
      quantity: selectedProduct.quantity,
      // Size and color are not applicable for combo options, so they are omitted.
    };

    dispatch(addToCart(payload))
      .unwrap() // .unwrap() is provided by RTK to handle the promise lifecycle
      .then(() => {
        toast.success(`Added "${selectedProduct.name}" to cart!`);
      })
      .catch((error) => {
        // Display a more specific error message if the API provides one
        const errorMessage = error?.message || 'Failed to add item. Please try again.';
        toast.error(errorMessage);
      });
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm text-gray-800 font-semibold">Purchase Options</h3>
      <fieldset className="mt-2">
        <div className="space-y-3">
          {purchaseOptions.map((option) => {
            const isSelected = selectedOptionId === option._id;
            return (
              <div
                key={option._id}
                onClick={() => setSelectedOptionId(option._id)}
                className={`relative flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{option.name}</p>
                  <p className="text-lg font-semibold text-gray-800">₹{option.price.toLocaleString('en-IN')}</p>
                </div>
                {isSelected && <CheckCircleIcon className="h-6 w-6 text-indigo-600" />}
              </div>
            );
          })}
        </div>
      </fieldset>
      <button
        onClick={handleAddToCartClick}
        className="mt-8 w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default PurchaseOptions;
