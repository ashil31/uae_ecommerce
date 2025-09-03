import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FiUser, FiShoppingBag, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';
import { logoutUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const AccountSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: FiUser,
      label: t('account.profile'),
      path: '/account'
    },
    {
      icon: FiShoppingBag,
      label: t('account.orders'),
      path: '/account/orders'
    },
    {
      icon: FiMapPin,
      label: t('account.addresses'),
      path: '/account/addresses'
    },
    {
      icon: FiSettings,
      label: t('account.settings'),
      path: '/account/settings'
    }
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    toast.success(t('auth.logoutSuccess'));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6">{t('account.myAccount')}</h2>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
        >
          <FiLogOut size={18} />
          <span>{t('account.logout')}</span>
        </button>
      </nav>
    </div>
  );
};

export default AccountSidebar;