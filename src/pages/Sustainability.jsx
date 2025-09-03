import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Leaf, Globe, Recycle, HeartHandshake } from "lucide-react";

const sustainabilityData = [
  {
    icon: <Leaf className="w-8 h-8 text-green-600" />,
    titleKey: "sustainability.values.0.title",
    descKey: "sustainability.values.0.description",
  },
  {
    icon: <Recycle className="w-8 h-8 text-blue-600" />,
    titleKey: "sustainability.values.1.title",
    descKey: "sustainability.values.1.description",
  },
  {
    icon: <Globe className="w-8 h-8 text-emerald-600" />,
    titleKey: "sustainability.values.2.title",
    descKey: "sustainability.values.2.description",
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-rose-600" />,
    titleKey: "sustainability.values.3.title",
    descKey: "sustainability.values.3.description",
  },
];

const Sustainability = () => {
  const { t } = useTranslation();

  return (
    <section className="px-4 md:px-12 py-16 bg-[#f7f5f1] from-white to-green-50 mt-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.h2
          className="text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t("sustainability.title")}
        </motion.h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("sustainability.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sustainabilityData.map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {t(item.titleKey)}
            </h4>
            <p className="text-gray-600 text-sm">{t(item.descKey)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Sustainability;
