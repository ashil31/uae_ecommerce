
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'UAE - Luxury Fashion for Modern Lifestyle',
  description = 'Discover premium fashion collections for men and women. Shop luxury clothing, accessories, and more at UAE.',
  keywords = 'luxury fashion, UAE fashion, men\'s clothing, women\'s clothing, premium accessories',
  image = '/images/og-image.jpg',
  url = window.location.href
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="UAE Fashion" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
