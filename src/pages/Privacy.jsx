import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Globe, FileText } from "lucide-react";

const Section = ({ icon: Icon, title, description }) => (
  <motion.div
    className="flex flex-col gap-2 p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true }}
  >
    <div className="flex items-center gap-3 text-primary">
      <Icon className="w-6 h-6" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </motion.div>
);

const Privacy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: ShieldCheck,
      title: t("privacy.sections.0.title"),
      description: t("privacy.sections.0.description"),
    },
    {
      icon: Lock,
      title: t("privacy.sections.1.title"),
      description: t("privacy.sections.1.description"),
    },
    {
      icon: FileText,
      title: t("privacy.sections.2.title"),
      description: t("privacy.sections.2.description"),
    },
    {
      icon: Globe,
      title: t("privacy.sections.3.title"),
      description: t("privacy.sections.3.description"),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-8 mt-12">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("privacy.title")}
      </motion.h1>
      <motion.p
        className="text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {t("privacy.description")}
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
        {sections.map((sec, idx) => (
          <Section key={idx} {...sec} />
        ))}
      </div>
    </div>
  );
};

export default Privacy;
