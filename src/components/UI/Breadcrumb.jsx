import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = ({ customPaths = [] }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  // Get query parameters
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  // Generate breadcrumbs based on query params when they exist
  const queryBreadcrumbs = [];
  if (category) {
    queryBreadcrumbs.push({
      name: formatBreadcrumbName(category),
      path: `/shop?category=${category}`
    });
    
    if (subcategory) {
      queryBreadcrumbs.push({
        name: formatBreadcrumbName(subcategory),
        path: `/shop?category=${category}&subcategory=${subcategory}`
      });
    }
  }

  // Use custom paths if provided, otherwise generate from URL or query params
  const breadcrumbs = customPaths.length > 0 
    ? customPaths 
    : queryBreadcrumbs.length > 0
      ? [{ name: t('nav.shop'), path: '/shop' }, ...queryBreadcrumbs]
      : location.pathname.split('/').filter(x => x).map((pathname, index) => {
          const path = `/${pathname.split('/').slice(0, index + 1).join('/')}`;
          return {
            name: formatBreadcrumbName(pathname),
            path: path
          };
        });

  // Helper function to format breadcrumb names
  function formatBreadcrumbName(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to="/" className="hover:text-black transition-colors">
        {t('nav.home')}
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={`${breadcrumb.path}-${index}`}>
          <FiChevronRight size={16} className="text-gray-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-black font-medium">{breadcrumb.name}</span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-black transition-colors"
            >
              {breadcrumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;