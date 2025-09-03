import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/UI/SEO';

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title="About UAE - Luxury Fashion Heritage | UAE"
        description="Discover UAE's story, our commitment to luxury fashion excellence, and our dedication to serving UAE's fashion enthusiasts."
        keywords="about UAE, luxury fashion brand, UAE fashion heritage, premium clothing"
      />
      
      <div className="container mx-auto px-4 py-8 mt-24">
        <h1 className="text-3xl font-bold mb-8">{t('nav.about')}</h1>
        <div className="prose max-w-none">
          <p>About page content coming soon.</p>
        </div>
      </div>
    </>
  );
};

export default About;
