import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accessibility,
  Brain,
  	Hammer,
  Wrench,
  Phone,
} from "lucide-react";

const principles = [
  {
    icon: <Accessibility className="w-6 h-6 text-primary" />,
    key: "commitment",
  },
  {
    icon: <Brain className="w-6 h-6 text-primary" />,
    key: "inclusiveDesign",
  },
  {
    icon: <	Hammer className="w-6 h-6 text-primary" />,
    key: "assistiveTech",
  },
  {
    icon: <Wrench className="w-6 h-6 text-primary" />,
    key: "ongoingImprovements",
  },
  {
    icon: <Phone className="w-6 h-6 text-primary" />,
    key: "contactSupport",
  },
];

const AccessibilityPage = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 bg-[#f7f5f1] text-gray-800 dark:text-white mt-16">
      <motion.h1
        className="text-3xl font-bold mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("accessibility.title")}
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-6">
        {principles.map(({ icon, key }, i) => (
          <motion.div
            key={key}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h2 className="text-xl font-semibold flex items-center gap-3 mb-2">
              {icon} {t(`accessibility.sections.${key}.title`)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t(`accessibility.sections.${key}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AccessibilityPage;
