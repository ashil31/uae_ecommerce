
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('account.profile')}</h1>
      <div className="bg-[#f7f5f1] p-6 rounded-lg border">
        <p className="text-gray-600">Profile management coming soon.</p>
        <p className="mt-2">Welcome, {user?.firstName || user?.email}!</p>
      </div>
    </div>
  );
};

export default Profile;
