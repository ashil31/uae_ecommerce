import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ChevronRight,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const Footer = () => {
  const { t } = useTranslation();
  const { isRTL } = useSelector((state) => state.ui);
  const [openSection, setOpenSection] = useState(-1);

  const footerSections = [
    {
      title: t("footer.getinTouch"),
      links: [
        { name: t("footer.links.contactUs"), href: "/contact" },
        // { name: t('footer.links.sizeGuide'), href: '/size-guide' },
        // { name: t('footer.links.shippingInfo'), href: '/shipping' },
        // { name: t('footer.links.returns'), href: '/returns' },
        { name: t("footer.links.faq"), href: "/faq" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { name: t("footer.links.uae"), href: "/about" },
        { name: t("footer.links.careers"), href: "/careers" },
        { name: t("footer.links.press"), href: "/press" },
        { name: t("footer.links.sustainability"), href: "/sustainability" },
        // { name: t('footer.links.storeLocator'), href: '/store-locator' },
      ],
    },
    {
      title: t("footer.services"),
      links: [
        { name: t("footer.links.service"), href: "/contact" },
        // { name: t('footer.links.sizeGuide'), href: '/size-guide' },
        { name: t("footer.links.del"), href: "/shipping" },
        { name: t("footer.links.returns"), href: "/returns" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { name: t("footer.links.privacyPolicy"), href: "/privacy" },
        { name: t("footer.links.termsOfService"), href: "/terms" },
        { name: t("footer.links.cookiePolicy"), href: "/cookies" },
        { name: t("footer.links.accessibility"), href: "/accessibility" },
      ],
    },
  ];

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? -1 : index);
  };

  return (
    <footer className={`bg-[#1E2B3C] text-white px-6 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Main Footer Content */}
      <div className="container  px-4 py-4 flex flex-col  gap-4 lg:flex-row  ">
        {/* Newsletter CTA */}
        <section className="py-4 px-4 text-white">
          <div className="container px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl lg:text-3xl font-light mb-2">
                Subscribe to our newsletter
              </h2>
              <p className="text-white/80 mb-4 font-light max-w-2xl mx-auto">
                Receive our newsletter and discover our world, collections, and
                latest news from us.
              </p>
              <div className=" mx-auto flex items-center justify-between border-b border-white">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow w-full bg-transparent border-none outline-none py-2 text-white placeholder-gray-400"
                />

                <button className="p-2 text-white ">
                  <ArrowRightIcon className="w-6 h-6 " />
                </button>
              </div>
              <p className="text-white/80 mb-6 mt-2 font-light max-w-2xl mx-auto">
                I acknowledge that my email address will be processed by UAE in
                accordance with the provisions of the Privacy Policy.
              </p>
            </motion.div>
          </div>
        </section>
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 py-2    ">
          
         
            

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="  m-2  sm:mt-0 ">
              {/* <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h4> */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center text-left sm:pointer-events-none border-b border-white sm:border-b-0"
              >
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                  {section.title}
                </h4>
                {/* Chevron icon, only visible on mobile (hidden on sm screens and up) */}
                <ChevronRightIcon
                  className={`w-5 h-5 sm:hidden transition-transform duration-300 ${
                    openSection === index ? "rotate-90" : ""
                  }`}
                />
              </button>
              <ul
                className={`space-y-2 sm:space-y-3 overflow-hidden transition-all duration-300 ease-in-out
                  ${openSection === index ? "max-h-96 mt-2" : "max-h-0"}
                  sm:max-h-full sm:mt-0`}
              >
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className=" mx-auto px-4 py-4 lg:mx-24 lg:px-12">
        <div className="flex justify-between  items-center  px-4 flex-col sm:flex-row  gap-2 ">
          {/* Language Selector */}
          <div className=" m-2 ">
            <LanguageSelector />
          </div>

          <div className="mt-2">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 block"
            >
              {t("footer.brandName")}
            </Link>
          </div>

          <div className="hidden lg:flex justify-center items-center gap-3 first: ">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiFacebook size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiInstagram size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiTwitter size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiYoutube size={18} className="sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 py-2 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;
