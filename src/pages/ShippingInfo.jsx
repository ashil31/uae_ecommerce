import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck, Globe, Timer, PackageSearch, HelpCircle } from 'lucide-react';

const shippingDetails = [
  {
    title: 'Domestic Shipping (UAE)',
    icon: <Truck className="w-6 h-6 text-blue-600" />,
    description:
      'We offer free standard shipping across the UAE on all orders above AED 200. Orders are processed within 1–2 business days and delivered within 2–4 business days.',
  },
  {
    title: 'Express Delivery',
    icon: <Timer className="w-6 h-6 text-blue-600" />,
    description:
      'Need it sooner? Choose Express Shipping at checkout for 1–2 business day delivery (AED 25 flat rate).',
  },
  {
    title: 'International Shipping',
    icon: <Globe className="w-6 h-6 text-blue-600" />,
    description:
      'We ship to select countries outside the UAE. Shipping charges vary by destination and are calculated at checkout. Customs duties may apply.',
  },
  {
    title: 'Order Tracking',
    icon: <PackageSearch className="w-6 h-6 text-blue-600" />,
    description:
      'Track your shipment using the tracking link sent via email or SMS. You can also track your order from your account dashboard.',
  },
  {
    title: 'Need Help?',
    icon: <HelpCircle className="w-6 h-6 text-blue-600" />,
    description: (
      <>
        For any shipping or delivery-related questions, feel free to{' '}
        <a href="/contact" className="text-blue-600 underline hover:text-blue-800">
          contact us
        </a>
        .
      </>
    ),
  },
];

const ShippingInfo = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-14 text-gray-800 mt-16">
      <Helmet>
        <title>Shipping Information | Your Store Name</title>
        <meta
          name="description"
          content="Learn about our shipping options, delivery timelines, and policies for local and international orders."
        />
      </Helmet>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Shipping Information</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about how your order gets to your doorstep.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {shippingDetails.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingInfo;
