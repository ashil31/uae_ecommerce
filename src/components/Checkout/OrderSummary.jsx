
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ImageUrl } from '../../services/url';

const OrderSummary = () => {
  const { t } = useTranslation();
  const { items, total, totalItems } = useSelector((state) => state.cart);

  const shippingCost = total > 500 ? 0 : 25;
  const tax = total * 0.05; // 5% VAT
  const finalTotal = total + shippingCost + tax;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{t('cart.orderSummary')}</h3>
      
      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.cartId} className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img
                src={`${ImageUrl}${item.productId?.images[0].url}` || '/images/placeholder-product.jpg'}
                alt={item.productId.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium text-sm">{item.productId.name}</p>
                <p className="text-xs text-gray-500">
                  {item.size && `Size: ${item.size}`} • Qty: {item.quantity}
                </p>
              </div>
            </div>
            <span className="font-medium">
              {(item.priceAtAddition * item.quantity).toFixed(2)} {t('common.currency')}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between">
          <span>{t('cart.subtotal')} ({totalItems} items)</span>
          <span>{total.toFixed(2)} {t('common.currency')}</span>
        </div>
        
        <div className="flex justify-between">
          <span>{t('cart.shipping')}</span>
          <span>
            {shippingCost === 0 ? t('common.free') : `${shippingCost} ${t('common.currency')}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>{t('cart.tax')} (VAT 5%)</span>
          <span>{tax.toFixed(2)} {t('common.currency')}</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold border-t pt-3">
          <span>{t('cart.total')}</span>
          <span>{finalTotal.toFixed(2)} {t('common.currency')}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
