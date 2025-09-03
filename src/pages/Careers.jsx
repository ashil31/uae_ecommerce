import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Briefcase, ChevronDown } from "lucide-react";
import { useState } from "react";

const jobList = [
  {
    title: "Frontend Developer",
    location: "Dubai, UAE",
    type: "Full-Time",
    description:
      "We are looking for a skilled React developer with strong UI/UX experience. Must be proficient in Tailwind CSS, responsive design, and Git workflows.",
  },
  {
    title: "Customer Support Executive",
    location: "Remote / UAE",
    type: "Part-Time",
    description:
      "Provide high-quality customer service via chat, email, and phone. Fluency in English & Arabic is preferred.",
  },
];

const Careers = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-gray-800 px-4 sm:px-10 py-12 mt-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">{t("careers.title", "Join Our Team")}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("careers.subtitle", "We’re always looking for passionate people to join our growing family.")}
        </p>
      </motion.div>

      {/* Job Listings */}
      <div className="max-w-4xl mx-auto space-y-6">
        {jobList.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border rounded-2xl p-6 bg-gray-50 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
              </div>
              <button
                onClick={() => toggleOpen(index)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <ChevronDown className={`w-6 h-6 transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
            </div>

            {openIndex === index && (
              <div className="mt-4 text-gray-700 space-y-3">
                <p>{job.description}</p>
                <a
                  href="mailto:hr@yourcompany.com"
                  className="inline-flex items-center text-blue-600 hover:underline font-medium"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t("careers.apply", "Apply Now")}
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <p className="text-gray-600">{t("careers.general", "Don't see a position that fits?")}</p>
        <a
          href="mailto:hr@yourcompany.com"
          className="mt-3 inline-flex items-center px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          {t("careers.sendResume", "Send us your resume")}
        </a>
      </div>
    </div>
  );
};

export default Careers;
