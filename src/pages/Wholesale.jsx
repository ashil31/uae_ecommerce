import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiPackage, FiTruck, FiDollarSign } from 'react-icons/fi';
import ProductCard from '../components/Product/ProductCard';
import Breadcrumb from '../components/UI/Breadcrumb';
import SEO from '../components/UI/SEO';
import WholesaleContactForm from '../forms/WholesaleContactForm';
const Wholesale = () => {
  const { t } = useTranslation();

// mock user
  //  const user = {
  //   name: 'Dev User',
  //   role: 'wholesaler',
  //   email: 'dev@example.com',
  // };

  const isAuthenticated = true;
  const userType = 'wholesaler';
  

  // const { isAuthenticated, userType } = useSelector((state) => state.auth);
  const [products] = useState([]);

  // Redirect if not wholesaler
  if (!isAuthenticated || userType !== 'wholesaler') {
    return <Navigate to="/contact" replace />;
  }

  //  useEffect(() => {
  //   setProducts([
  //     {
  //       id: 'w1',
  //       name: 'Premium Cotton Shirt (Bulk)',
  //       brand: 'UAE',
  //       price: 199,
  //       originalPrice: 299,
  //       images: ['/images/shirt-bulk.jpg'],
  //       category: 'men',
  //       moq: 50,
  //       availability: 'In Stock',
  //       bulkPricing: [
  //         { minQty: 50, pricePerUnit: 199 },
  //         { minQty: 100, pricePerUnit: 180 },
  //         { minQty: 200, pricePerUnit: 160 },
  //       ]
  //     },
  //     {
  //       id: 'w2',
  //       name: 'Silk Scarves Collection',
  //       brand: 'UAE',
  //       price: 89,
  //       originalPrice: 149,
  //       images: ['/images/scarf-bulk.jpg'],
  //       category: 'women',
  //       moq: 100,
  //       availability: 'Limited Stock',
  //       bulkPricing: [
  //         { minQty: 100, pricePerUnit: 89 },
  //         { minQty: 200, pricePerUnit: 79 },
  //         { minQty: 500, pricePerUnit: 69 },
  //       ]
  //     },
  //     {
  //       id: 'w3',
  //       name: 'Leather Belt Set',
  //       brand: 'UAE',
  //       price: 129,
  //       originalPrice: 199,
  //       images: ['/images/belt-bulk.jpg'],
  //       category: 'accessories',
  //       moq: 25,
  //       availability: 'In Stock',
  //       bulkPricing: [
  //         { minQty: 25, pricePerUnit: 129 },
  //         { minQty: 100, pricePerUnit: 115 },
  //         { minQty: 300, pricePerUnit: 99 },
  //       ]
  //     },
  //   ]);
  // }, []);

  const breadcrumbs = [{ name: 'Wholesale Catalog', path: '/wholesale' }];

  return (
    <>
      <SEO
        title="Wholesale - B2B Fashion Solutions | UAE"
        description="Explore UAE wholesale opportunities for retailers. Bulk ordering, competitive pricing, and premium fashion collections for your business."
        keywords="wholesale fashion, B2B clothing, bulk orders, fashion retailers UAE"
      />

{/* Added for Fallback */}
      <Helmet>
  <title>{t('wholesale.fallbackTitle')}</title>
</Helmet>

      
      <div className="container mt-24 bg-[#f7f5f1]  mx-auto px-4 py-8">
        <Breadcrumb customPaths={breadcrumbs} />
        
       <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('wholesale.pageTitle')}</h1>
          <p className="text-gray-600">{t('wholesale.pageDescription')}</p>
        </header>


{/* Wholse Form */}
<div className="mt-12 bg-[#f7f5f1]  p-8 rounded-lg shadow-2xl">
  <h2 className="text-2xl font-bold mb-6 text-center">{t('wholesale.formTitle')}</h2>
  <WholesaleContactForm products={products} />
</div>


        {/* Wholesale Perks */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: <FiPackage className="text-blue-600 w-8 h-8" />, title: "Bulk Pricing", desc: "Save up to 40% on MOQ orders" },
            { icon: <FiTruck className="text-green-600 w-8 h-8" />, title: "Free Shipping", desc: "Available on all wholesale orders" },
            { icon: <FiDollarSign className="text-purple-600 w-8 h-8" />, title: "Payment Terms", desc: "Flexible for verified businesses" },
          ].map((perk, i) => (
            <div key={i} className="bg-[#f7f5f1] p-6 border rounded-lg">
              {perk.icon}
              <h3 className="mt-3 font-semibold">{perk.title}</h3>
              <p className="text-sm text-gray-600">{perk.desc}</p>
            </div>
          ))}
        </div> */}

        {/* Product Grid */}
        {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-[#f7f5f1] rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.target.src = '/images/placeholder-product.jpg')}
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p> */}

                {/* Price block */}
                {/* <div className="mb-3">
                  <span className="text-xl font-bold text-black">{product.price} AED</span>
                  <span className="ml-2 line-through text-sm text-gray-500">{product.originalPrice} AED</span>
                </div> */}

                {/* MOQ and Stock */}
                {/* <div className="flex justify-between text-sm mb-2">
                  <span>MOQ: {product.moq} units</span>
                  <span className={`font-medium ${product.availability === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
                    {product.availability}
                  </span>
                </div> */}

                {/* Bulk Pricing Table */}
                {/* {product.bulkPricing?.length > 0 && (
                  <div className="mb-4 text-sm text-gray-700">
                    <p className="font-medium mb-1">Bulk Pricing:</p>
                    <ul className="space-y-1">
                      {product.bulkPricing.map((tier, idx) => (
                        <li key={idx}>
                          Min {tier.minQty}: <strong>{tier.pricePerUnit} AED</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition">
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </section> */}

        {/* Contact Box */}
        {/* <div className="mt-12 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Need Custom Solutions?</h2>
          <p className="text-gray-600 mb-6">Contact our team for large orders, brand collaborations, or tailored pricing plans.</p>
          <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition">
            Contact Wholesale Team
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Wholesale;