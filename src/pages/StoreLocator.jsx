import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMapPin, FiSearch, FiPhone, FiClock } from "react-icons/fi";

const stores = [
  {
    id: 1,
    name: "Dubai Mall Store",
    address: "Ground Floor, Dubai Mall, Downtown Dubai, UAE",
    phone: "+971 4 123 4567",
    hours: "10:00 AM – 11:00 PM",
    location: "dubai",
  },
  {
    id: 2,
    name: "Marina Mall Store",
    address: "Level 1, Marina Mall, Dubai Marina, UAE",
    phone: "+971 4 987 6543",
    hours: "10:00 AM – 10:00 PM",
    location: "marina",
  },
];

const mapUrl = "https://www.google.com/maps/embed?pb=...";

const StoreLocator = () => {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(query.toLowerCase()) ||
    store.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mt-12 pt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Store Search & Results */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("storeLocator.title")}
          </h2>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              placeholder={t("storeLocator.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <FiSearch className="text-gray-500 w-5 h-5" />
          </div>

          <div className="space-y-6">
            {filteredStores.length === 0 && (
              <p className="text-gray-500 italic">{t("storeLocator.noResults")}</p>
            )}
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-[#f7f5f1] p-5 rounded-lg shadow border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {store.name}
                </h3>
                <p className="flex items-start text-sm text-gray-600 gap-2 mb-1">
                  <FiMapPin className="mt-[2px]" />
                  {store.address}
                </p>
                <p className="flex items-center text-sm text-gray-600 gap-2 mb-1">
                  <FiPhone /> {t("storeLocator.phone")}: {store.phone}
                </p>
                <p className="flex items-center text-sm text-gray-600 gap-2">
                  <FiClock /> {t("storeLocator.hours")}: {store.hours}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Map */}
        <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-md border border-gray-200">
          <iframe
            title="Store map"
            src={mapUrl}
            allowFullScreen=""
            loading="lazy"
            className="w-full h-full"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default StoreLocator;
