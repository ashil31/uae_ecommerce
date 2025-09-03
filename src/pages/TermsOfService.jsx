import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const sections = ["intro", "usage", "account", "limitation", "governingLaw"];

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#f7f5f1] text-gray-800 py-16 px-6 sm:px-10 max-w-5xl mx-auto mt-16">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("terms.title")}
      </motion.h1>

      <div className="space-y-10">
        {sections.map((key, idx) => (
          <motion.div
            key={key}
            className="bg-gray-50 rounded-2xl shadow p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-primary">
              {t(`terms.sections.${key}.title`)}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              {t(`terms.sections.${key}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfService;
