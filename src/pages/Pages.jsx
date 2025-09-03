import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, Newspaper, Filter } from "lucide-react";

const pressData = [
  {
    id: 1,
    titleKey: "press.1.title",
    descKey: "press.1.description",
    date: "2024-09-21",
    category: "Awards",
  },
  {
    id: 2,
    titleKey: "press.2.title",
    descKey: "press.2.description",
    date: "2024-06-05",
    category: "Partnership",
  },
  {
    id: 3,
    titleKey: "press.3.title",
    descKey: "press.3.description",
    date: "2024-03-11",
    category: "Launch",
  },
];

const categories = ["All", "Awards", "Partnership", "Launch"];

const Press = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = pressData.filter(item => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = t(item.titleKey)
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold text-center mb-6">
          {t("press.title")}
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("press.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {t(`press.categories.${cat.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Press Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(({ id, titleKey, descKey, date, category }) => (
            <motion.div
              key={id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-6"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Newspaper className="text-primary" />
                <div>
                  <p className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</p>
                  <p className="text-xs bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-600">
                    {t(`press.categories.${category.toLowerCase()}`)}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(titleKey)}</h3>
              <p className="text-sm text-gray-600">{t(descKey)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Press;
