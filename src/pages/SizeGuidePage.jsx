import React, { useState } from 'react';
import { Ruler, Info, ChevronRight, User, Footprints, ChevronDown } from 'lucide-react';

/**
 * Enhanced Size Guide Component with click-to-expand functionality
 */
const SizeGuide = ({ category = 'clothing', isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('women');
  const [unit, setUnit] = useState('cm');
  const [hoveredSize, setHoveredSize] = useState(null);

  const sizeCharts = {
    clothing: {
      women: {
        cm: [
          { size: 'XS', bust: '81-84', waist: '61-64', hips: '86-89' },
          { size: 'S', bust: '86-89', waist: '66-69', hips: '91-94' },
          { size: 'M', bust: '91-94', waist: '71-74', hips: '96-99' },
          { size: 'L', bust: '96-99', waist: '76-79', hips: '101-104' },
          { size: 'XL', bust: '101-106', waist: '81-86', hips: '106-111' },
          { size: 'XXL', bust: '111-116', waist: '91-96', hips: '116-121' }
        ],
        inches: [
          { size: 'XS', bust: '32-33', waist: '24-25', hips: '34-35' },
          { size: 'S', bust: '34-35', waist: '26-27', hips: '36-37' },
          { size: 'M', bust: '36-37', waist: '28-29', hips: '38-39' },
          { size: 'L', bust: '38-39', waist: '30-31', hips: '40-41' },
          { size: 'XL', bust: '40-42', waist: '32-34', hips: '42-44' },
          { size: 'XXL', bust: '44-46', waist: '36-38', hips: '46-48' }
        ]
      },
      men: {
        cm: [
          { size: 'XS', chest: '86-89', waist: '71-74', hips: '86-89' },
          { size: 'S', chest: '91-94', waist: '76-79', hips: '91-94' },
          { size: 'M', chest: '96-99', waist: '81-84', hips: '96-99' },
          { size: 'L', chest: '101-106', waist: '86-91', hips: '101-106' },
          { size: 'XL', chest: '111-116', waist: '96-101', hips: '111-116' },
          { size: 'XXL', chest: '121-126', waist: '106-111', hips: '121-126' }
        ],
        inches: [
          { size: 'XS', chest: '34-35', waist: '28-29', hips: '34-35' },
          { size: 'S', chest: '36-37', waist: '30-31', hips: '36-37' },
          { size: 'M', chest: '38-39', waist: '32-33', hips: '38-39' },
          { size: 'L', chest: '40-42', waist: '34-36', hips: '40-42' },
          { size: 'XL', chest: '44-46', waist: '38-40', hips: '44-46' },
          { size: 'XXL', chest: '48-50', waist: '42-44', hips: '48-50' }
        ]
      }
    },
    shoes: {
      women: {
        cm: [
          { size: 'US 5 / EU 35', length: '22.5' },
          { size: 'US 6 / EU 36', length: '23.0' },
          { size: 'US 7 / EU 37', length: '23.5' },
          { size: 'US 8 / EU 38', length: '24.0' },
          { size: 'US 9 / EU 39', length: '25.0' },
          { size: 'US 10 / EU 40', length: '25.5' }
        ],
        inches: [
          { size: 'US 5 / EU 35', length: '8.9' },
          { size: 'US 6 / EU 36', length: '9.1' },
          { size: 'US 7 / EU 37', length: '9.3' },
          { size: 'US 8 / EU 38', length: '9.4' },
          { size: 'US 9 / EU 39', length: '9.8' },
          { size: 'US 10 / EU 40', length: '10.0' }
        ]
      },
      men: {
        cm: [
          { size: 'US 7 / EU 40', length: '25.5' },
          { size: 'US 8 / EU 41', length: '26.0' },
          { size: 'US 9 / EU 42', length: '26.5' },
          { size: 'US 10 / EU 43', length: '27.0' },
          { size: 'US 11 / EU 44', length: '27.5' },
          { size: 'US 12 / EU 45', length: '28.0' }
        ],
        inches: [
          { size: 'US 7 / EU 40', length: '10.0' },
          { size: 'US 8 / EU 41', length: '10.2' },
          { size: 'US 9 / EU 42', length: '10.4' },
          { size: 'US 10 / EU 43', length: '10.6' },
          { size: 'US 11 / EU 44', length: '10.8' },
          { size: 'US 12 / EU 45', length: '11.0' }
        ]
      }
    }
  };

  const measurementTips = {
    clothing: {
      bust: 'Measure around the fullest part of your bust',
      chest: 'Measure around the fullest part of your chest',
      waist: 'Measure around your natural waistline',
      hips: 'Measure around the fullest part of your hips'
    },
    shoes: {
      length: 'Measure from heel to longest toe while standing'
    }
  };

  const currentChart = sizeCharts[category]?.[activeTab]?.[unit] || [];

  return (
    <div className="bg-[#f7f5f1] border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Clickable Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-blue-50 transition-colors duration-200 text-left flex items-center justify-between group"
      >
        <div className="flex items-center">
          {category === 'clothing' ? (
            <User className="w-5 h-5 text-black mr-3" />
          ) : (
            <Footprints className="w-5 h-5 text-black mr-3" />
          )}
          <h3 className="text-lg font-semibold text-black">
            {category === 'clothing' ? 'Clothing Size Chart' : 'Shoe Size Chart'}
          </h3>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Expandable Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="p-6 border-t border-gray-100">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(sizeCharts[category] || {}).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-100 text-black border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-black">Measurements:</span>
              <div className="flex bg-gray-100 rounded-md p-1">
                {['cm', 'inches'].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                      unit === u
                        ? 'bg-[#f7f5f1] text-black shadow-sm border border-gray-200'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Hover over sizes for highlighting
            </div>
          </div>

          {/* Size Chart Table */}
          <div className="overflow-x-auto mb-6">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-black uppercase tracking-wide">
                        Size
                      </th>
                      {currentChart.length > 0 &&
                        Object.keys(currentChart[0])
                          .filter((key) => key !== 'size')
                          .map((measurement) => (
                            <th
                              key={measurement}
                              className="px-4 py-3 text-left text-sm font-semibold text-black uppercase tracking-wide"
                            >
                              {measurement.charAt(0).toUpperCase() + measurement.slice(1)}
                              <span className="text-xs text-gray-500 ml-1 normal-case">({unit})</span>
                            </th>
                          ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentChart.map((row, index) => (
                      <tr
                        key={index}
                        onMouseEnter={() => setHoveredSize(index)}
                        onMouseLeave={() => setHoveredSize(null)}
                        className={`transition-colors duration-200 ${
                          hoveredSize === index
                            ? 'bg-blue-50'
                            : index % 2 === 0
                            ? 'bg-[#f7f5f1] hover:bg-gray-50'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            hoveredSize === index
                              ? 'bg-blue-100 text-black border border-blue-200'
                              : 'bg-gray-100 text-black'
                          }`}>
                            {row.size}
                          </div>
                        </td>
                        {Object.entries(row)
                          .filter(([key]) => key !== 'size')
                          .map(([key, value]) => (
                            <td
                              key={key}
                              className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700"
                            >
                              {value}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Measurement Tips */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Info className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-2">
                  How to Measure
                </h3>
                <div className="space-y-2">
                  {Object.entries(measurementTips[category] || {}).map(([key, tip]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <ChevronRight className="w-3 h-3 text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-black capitalize">{key}:</span>
                        <span className="text-gray-700 ml-1">{tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-[#f7f5f1] rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong className="text-black">Pro Tip:</strong> For best results, have someone help you measure or use a measuring tape while wearing form-fitting clothing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SizeGuidePage = () => {
  const [openSections, setOpenSections] = useState({
    clothing: false,
    shoes: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen pt-32 bg-[#f7f5f1]">
      <div className="container pt-20 mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Ruler className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">
              Size Guide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive size charts. Click on any section below to view detailed measurements.
            </p>
          </div>

          {/* Size Guide Sections */}
          <div className="space-y-6">
            <SizeGuide 
              category="clothing" 
              isOpen={openSections.clothing}
              onToggle={() => toggleSection('clothing')}
            />
            
            <SizeGuide 
              category="shoes" 
              isOpen={openSections.shoes}
              onToggle={() => toggleSection('shoes')}
            />
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Size Conversion Tips
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-[#f7f5f1] rounded-lg border border-gray-200">
                <h4 className="font-semibold text-black mb-2">📐 Conversion</h4>
                <p className="text-gray-700 text-sm">
                  <strong>1 inch = 2.54 cm</strong> - Use this conversion if you're more familiar with one measurement system
                </p>
              </div>
              <div className="p-4 bg-[#f7f5f1] rounded-lg border border-gray-200">
                <h4 className="font-semibold text-black mb-2">📏 Between Sizes</h4>
                <p className="text-gray-700 text-sm">
                  If you're between sizes, we recommend sizing up for comfort
                </p>
              </div>
              <div className="p-4 bg-[#f7f5f1] rounded-lg border border-gray-200">
                <h4 className="font-semibold text-black mb-2">🏷 Brand Variations</h4>
                <p className="text-gray-700 text-sm">
                  Different brands may have slight variations in sizing - always check the specific product's size chart when available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;

