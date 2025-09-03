import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const MegaMenu = ({ category, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const menuData = {
    men: {
      clothing: [
        { name: "Shirt" },
        { name: "T-Shirt" },
        { name: "Suit" },
        { name: "Jacket" },
        { name: "Trouser" },
        { name: "Jeans" },
        { name: "Knitwear" },
        { name: "Activewear" },
      ],
      accessories: [
        { name: "Watches" },
        { name: "Bags" },
        { name: "Shoes" },
        { name: "Belts" },
        { name: "Sunglasses" },
        { name: "Ties" },
      ],
      featured: [
        { name: "New Arrivals" },
        { name: "Best Sellers" },
        { name: "Sale" },
        { name: "Lookbook" },
      ],
    },
    women: {
      clothing: [
        { name: "Dresses" },
        { name: "Tops" },
        { name: "Skirts" },
        { name: "Pants" },
        { name: "Jeans" },
        { name: "Jacket" },
        { name: "Knitwear" },
        { name: "Activewear" },
      ],
     
      accessories: [
        { name: "Handbags" },
        { name: "Shoes" },
        { name: "Jewelry" },
        { name: "Scarves" },
        { name: "Sunglasses" },
        { name: "Watches" },
      ],
      featured: [
        { name: "New Arrivals" },
        { name: "Best Sellers" },
        { name: "Sale" },
        { name: "Lookbook" },
      ],
    },
    newIn: {
      men: [
        { name: "All New Arrivals" },
        { name: "Clothing" },
        { name: "Shoes" },
        { name: "Accessories" },
      ],
      women: [
        { name: "All New Arrivals" },
        { name: "Clothing" },
        { name: "Shoes" },
        { name: "Accessories" },
      ],
      featured: [
        { name: "This Week" },
        { name: "Last 30 Days" },
        { name: "Coming Soon" },
      ],
    },
    readyToWear: {
      men: [
        { name: "Casual" },
        { name: "Business" },
        { name: "Formal" },
        { name: "Weekend" },
      ],
      women: [
        { name: "Casual" },
        { name: "Business" },
        { name: "Evening" },
        { name: "Weekend" },
      ],
      collections: [
        { name: "Spring Collection" },
        { name: "Summer Collection" },
        { name: "Designer Collections" },
      ],
    },
    accessories: {
      bags: [
        { name: "Handbags" },
        { name: "Backpacks" },
        { name: "Briefcases" },
        { name: "Travel Bags" },
      ],
      jewelry: [
        { name: "Necklaces" },
        { name: "Bracelets" },
        { name: "Earrings" },
        { name: "Rings" },
      ],
      others: [
        { name: "Watches" },
        { name: "Sunglasses" },
        { name: "Scarves" },
        { name: "Belts" },
      ],
    },
     kids: [
        
      ],
     
  };

  const currentMenu = menuData[category];
  if (!currentMenu) return null;

  // Function to generate the correct link path - only handles Lookbook specially
  const generateLinkPath = (itemName) => {
    // Special handling for Lookbook only
    if (itemName.toLowerCase() === "lookbook") {
      // If it's from men or women category, go to lookbook with category filter
      if (category === "men" || category === "women") {
        return `/lookbook?category=${category}`;
      }
      // Otherwise, go to general lookbook page
      return "/lookbook";
    }
    
    // Default shop path for all other items
    return `/shop/${category.toLowerCase()}/${itemName.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <motion.div
      dir={isRTL ? 'rtl' : 'ltr'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={`absolute top-full transform ${
        isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'
      } w-screen max-w-2xl bg-[#f7f5f1] shadow-2xl border-t border-gray-100 z-50 overflow-hidden rounded-b-xl`}
      onMouseLeave={onClose}
    >
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
          {Object.entries(currentMenu).map(([sectionKey, items]) => (
            <div key={sectionKey} className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-2">
                {t(`menu.${sectionKey}`)}
              </h3>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={generateLinkPath(item.name)}
                      onClick={onClose}
                    >
                      {t(`menu.${item.name.toLowerCase().replace(/\s+/g, "")}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
