import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import AccountSidebar from '../../components/Account/AccountSidebar';
import Profile from '../Profile';
import Orders from './Orders';
import OrderTracking from './OrderTracking';
import Addresses from './Addresses';
import Settings from './Settings';

const Account = () => {
  const { t } = useTranslation();

  return (  
    <>
      <Helmet>
        <title>{`${t('account.myAccount')} - UAE`}</title>
      </Helmet>

      <div className="container bg-[#f7f5f1] mx-auto pt-32 px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>
    
          <div className="lg:col-span-3">
            <Routes>
              <Route index element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:orderId" element={<OrderTracking />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;