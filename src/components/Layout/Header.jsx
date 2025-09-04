import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiBookmark,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import {
  calculateTotals,
  fetchCart,
  toggleCart,
} from "../../store/slices/cartSlice";
import { toggleMobileMenu, toggleSearch } from "../../store/slices/uiSlice";
import Logo from "../../assets/logo.png";
import MegaMenu from "./MegaMenu";
import SearchComponent from "../UI/SearchComponent";
import LanguageSelector from "./LanguageSelector";

// Simplified data structure for the mobile menu
const mobileMenuContent = {
  men: [
    { key: "shirt", label: "Shirt", href: "/shop/men/shirt" },
    { key: "tshirt", label: "T-Shirt", href: "/shop/men/tshirt" },
    {
      key: "bomber & gillets",
      label: "Bomber & Gillets",
      href: "/shop/men/bomber-gillets",
    },
    {
      key: "travelers&coats",
      label: "Travelers jacket & coats",
      href: "/shop/men/travelers&coats",
    },
    {
      key: "outerwear-linens",
      label: "Outerwear Linens",
      href: "/shop/men/outerwear-linens",
    },
    { key: "beachwear", label: "Beachwear", href: "/shop/men/beachwear" },
  ],
  women: [
    { key: "dress", label: "Dresses", href: "/shop/women/dress" },
    { key: "tops", label: "Tops", href: "/shop/women/tops" },
    {
      key: "bomber-jackets",
      label: "Bomber Jackets",
      href: "/shop/women/bomber-jackets",
    },
    {
      key: "travelers-jackets",
      label: "Travelers jackets & coats",
      href: "/shop/women/travelers-jackets",
    },
    {
      key: "ready-to-wear-linens",
      label: "Ready to wear Linens",
      href: "/shop/women/ready-to-wear-linens",
    },
  ],
};

// AccordionItem for mobile menu
const AccordionItem = ({ item, isOpen, onToggle, onLinkClick }) => {
  const submenuLinks = mobileMenuContent[item.key] || [];

  if (!item.hasSubmenu) {
    return (
      <Link
        to={item.href}
        className="block text-lg font-semibold tracking-wide text-gray-800 transition-all duration-300 ease-in-out hover:text-black py-2"
        onClick={onLinkClick}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-base font-medium text-gray-700 hover:text-black py-2"
      >
        <span>{item.label}</span>
        {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4"
          >
            <div className="space-y-2 py-4 pl-2 border-l-2 border-gray-200">
              {submenuLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  onClick={onLinkClick}
                  className="block text-gray-600 hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { mobileMenuOpen, isSearchOpen } = useSelector((state) => state.ui);

  const isRTL = i18n.dir() === "rtl";

  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [openAccordionKey, setOpenAccordionKey] = useState(null);

  const isHomePage = location.pathname === "/";

  const handleAccordionToggle = (key) => {
    setOpenAccordionKey(openAccordionKey === key ? null : key);
  };

  useEffect(() => {
    dispatch(calculateTotals());
  }, [totalItems, dispatch, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchCart()).then(() => dispatch(calculateTotals()));
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  const navItems = [
    { key: "men", label: t("nav.men"), href: "/shop/men", hasSubmenu: true },
    {
      key: "women",
      label: t("nav.women"),
      href: "/shop/women",
      hasSubmenu: true,
    },
    {
      key: "kids",
      label: t("nav.kids"),
      href: "/shop/kids",
      hasSubmenu: false,
    },
    ...(isAuthenticated
      ? [
          {
            key: "wholesale",
            label: t("nav.wholesale"),
            href: "/wholesale",
            hasSubmenu: false,
          },
        ]
      : []),
    {
      key: "sale",
      label: t("nav.sale"),
      href: "/shop/sale",
      hasSubmenu: false,
    },
    {
      key: "leathergoods",
      label: t("nav.leathergoods"),
      href: "/shop/leathergoods",
      hasSubmenu: false,
    },
    {
      key: "lookbook",
      label: t("nav.lookbook"),
      href: "/lookbook",
      hasSubmenu: false,
    },
  ];

  // Header bg: transparent on top of homepage, black after scroll or on other pages
  const getHeaderStyles = () => {
    if (isHomePage) {
      return scrolled
        ? "bg-black backdrop-blur-md shadow-md"
        : "bg-transparent";
    }
    return "bg-black backdrop-blur-md shadow-md";
  };

  // Text styles
  const getTextStyles = () => {
    if (isHomePage && !scrolled) {
      return {
        text: "text-white",
        hover: "hover:text-white",
      };
    }
    return {
      text: "text-white",
      hover: "hover:text-white/90",
    };
  };

  const textStyles = getTextStyles();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderStyles()} ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="container mx-auto py-3 px-4 lg:px-6 ">
          <div
            className={`flex items-center justify-between h-16 lg:h-20 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 transition-colors ${textStyles.text} ${textStyles.hover}`}
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <FiX className="h-7 w-7 sm:h-5 sm:w-5" />
              ) : (
                <FiMenu className="h-7 w-7 sm:h-5 sm:w-5" />
              )}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 px-4 absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0"
            >
              <div
                className={`text-xl lg:text-2xl font-bold tracking-wider transition-colors ${textStyles.text}`}
              >
                <img
                  src={Logo}
                  alt="UAE"
                  className="h-20 px-4 sm:h-20 w-auto"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-3 rtl:space-x-reverse">
              {navItems.map((item) => (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasSubmenu && setHoveredMenu(item.key)
                  }
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <Link
                    to={item.href}
                    className={`
                      ${textStyles.text}
                      transition-all duration-300 ease-in-out
                      font-medium tracking-wide text-sm uppercase
                      relative inline-flex items-center px-4 py-2 rounded-full
                      hover:bg-black/70 hover:text-white
                    `}
                  >
                    {item.label}
                  </Link>

                  {item.hasSubmenu && hoveredMenu === item.key && (
                    <AnimatePresence>
                      <MegaMenu
                        category={item.key}
                        onClose={() => setHoveredMenu(null)}
                        isOpen={true}
                        isRTL={isRTL}
                      />
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div
              className={`relative flex items-center space-x-2 lg:space-x-3 rtl:space-x-reverse`}
            >
              <motion.button
                onClick={() => dispatch(toggleSearch())}
                className={`p-2 rounded-full ${textStyles.text} hover:bg-black/5 transition-colors duration-300`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Search"
              >
                <FiSearch className="h-7 w-7 sm:h-5 sm:w-5" />
              </motion.button>

              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className={`hidden md:inline-flex p-2 rounded-full ${textStyles.text} hover:bg-black/5 transition-colors duration-300`}
              >
                <FiUser size={18} />
              </Link>

              <Link
                to="/wishlist"
                className={`relative hidden md:inline-flex p-2 rounded-full ${textStyles.text} hover:bg-black/5 transition-colors duration-300`}
              >
                <FiBookmark size={18} />
                {wishlistItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>

              <button
                onClick={() => dispatch(toggleCart())}
                className={`relative p-2 rounded-full ${textStyles.text} hover:bg-black/5 transition-colors duration-300`}
              >
                <FiShoppingBag className="h-7 w-7 sm:h-5 sm:w-5" />
                {isAuthenticated && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div
              initial={{ x: isRTL ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 300 : -300 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-0 ${
                isRTL ? "right-0" : "left-0"
              } h-screen w-full z-[9999] max-w-xs bg-[#f7f5f1] shadow-2xl lg:hidden overflow-y-auto`}
            >
              <div className="p-6 m-8">
                <button
                  onClick={() => dispatch(toggleMobileMenu())}
                  className="absolute top-6 right-6"
                >
                  <FiX size={20} />
                </button>

                <div className="flex items-center justify-between mb-8 p-4">
                  <h2 className="text-lg font-medium"></h2>
                </div>

                {/* sign in button */}
                <div>
                  <div className="m-2 py-2">
                    <LanguageSelector />
                  </div>
                  <Link to={isAuthenticated ? "/account" : "/login"}>
                    <button
                      type="button"
                      className="m-3 block w-full bg-black text-white py-3 px-4 text-center font-medium rounded-md"
                    >
                      Sign In / Register
                    </button>
                  </Link>
                </div>

                <nav className="space-y-4 p-4">
                  {navItems.map((item) => (
                    <AccordionItem
                      key={item.key}
                      item={item}
                      isOpen={openAccordionKey === item.key}
                      onToggle={() => handleAccordionToggle(item.key)}
                      onLinkClick={() => dispatch(toggleMobileMenu())}
                    />
                  ))}
                  <div className="border-t pt-4 space-y-3">
                    <Link
                      to="/account"
                      className="block text-base font-medium text-gray-700 hover:text-black py-2"
                    >
                      {t("nav.account")}
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block text-base font-medium text-gray-700 hover:text-black py-2"
                    >
                      {t("nav.wishlist")}
                    </Link>
                  </div>
                </nav>
              </div>
            </div>

            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 lg:hidden z-40"
              onClick={() => dispatch(toggleMobileMenu())}
            />
          </>
        )}

        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-32 lg:h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-500
    ${isHomePage && !scrolled ? "opacity-100" : "opacity-0"}
    -z-10
  `}
        ></div>
      </header>

      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => dispatch(toggleSearch())}
      />
    </>
  );
};

export default Header;
