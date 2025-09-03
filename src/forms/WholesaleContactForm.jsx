import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice';
import axios from 'axios';
import { Listbox } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const WholesaleContactForm = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [totalCost, setTotalCost] = useState(0);
const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch]);

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const wholesaleTiers = selectedProduct?.wholesale?.length
    ? selectedProduct.wholesale
    : [
        { _id: 'demo1', moq: 100, price: 200 },
        { _id: 'demo2', moq: 200, price: 180 },
        { _id: 'demo3', moq: 300, price: 160 },
        { _id: 'demo4', moq: 400, price: 150 },
      ];

  useEffect(() => {
    if (selectedTier && quantity) {
      setTotalCost(Number(selectedTier.price) * Number(quantity));
    } else {
      setTotalCost(0);
    }
  }, [selectedTier, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const payload = {
        name,
        email,
        company,
        productId: selectedProductId,
        productName: selectedProduct?.name,
        tier: selectedTier,
        quantity,
        total: totalCost,
      };

      await axios.post('/api/wholesale-request', payload);
      setSuccessMsg('Request submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
      setSuccessMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded-xl p-6 space-y-6 max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-gray-800">{t('wholesaleForm.title')}</h2>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('wholesaleForm.fullName')}
          </label>
          <input
            type="text"
            className="w-full bg-white border border-gray-300 p-3 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
           {t('wholesaleForm.email')}
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg bg-white "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
           {t('wholesaleForm.company')}
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 bg-white  p-3 rounded-lg"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>

      {/* Product Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('wholesaleForm.selectProduct')}
        </label>
        <Listbox value={selectedProductId} onChange={(value) => {
  setSelectedProductId(value);
  setSelectedTier(null);
  setQuantity('');
}}>
  <div className="relative z-50 mt-1">
    <Listbox.Button className="relative w-full cursor-pointer rounded bg-white py-2 pl-3 pr-10 text-left shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
  <span>{selectedProductId ? products.find(p => p._id === selectedProductId)?.name : t('wholesaleForm.selectProductPlaceholder')}</span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </span>
    </Listbox.Button>

    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
      {products.map((product) => (
        <Listbox.Option
          key={product._id}
          className={({ active }) =>
            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
              active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
            }`
          }
          value={product._id}
        >
          {({ selected }) => (
            <>
              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                {product.name}
              </span>
              {selected ? (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : null}
            </>
          )}
        </Listbox.Option>
      ))}
    </Listbox.Options>
  </div>
</Listbox>

      </div>

      {/* MOQ Tier Cards */}
      {selectedProduct && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">{t('wholesaleForm.selectTier')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wholesaleTiers.map((tier) => (
              <button
                type="button"
                key={tier._id}
                onClick={() => {
                  setSelectedTier(tier);
                  setQuantity(tier.moq);
                }}
                className={`p-4 border rounded-lg text-left shadow-sm transition hover:shadow-md ${
                  selectedTier?._id === tier._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="font-semibold">{t('wholesaleForm.moq', { moq: tier.moq })}</div>
                <div className="text-sm text-gray-600">{t('wholesaleForm.price', { price: tier.price })}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Estimate */}
      {selectedTier && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('wholesaleForm.quantityLabel', { min: selectedTier.moq })}
            </label>
            <input
              type="number"
              className="w-full bg-white  border border-gray-300 p-3 rounded-lg"
              value={quantity}
              min={selectedTier.moq}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="text-lg font-semibold text-gray-800">
            {t('wholesaleForm.estimate', { total: totalCost.toLocaleString() })}
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || !selectedProductId || !selectedTier || !quantity}
          className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 w-full"
        >
        {loading ? t('wholesaleForm.submitting') : t('wholesaleForm.submit')}
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="text-green-600 font-medium text-center mt-4">
         {t(`wholesaleForm.${successMsg}`)}
        </div>
      )}
    </form>
  );
};

export default WholesaleContactForm;
