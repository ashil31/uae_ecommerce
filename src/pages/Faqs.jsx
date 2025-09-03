import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I return a product?",
    answer:
      "To initiate a return, go to the Returns section, fill out the return form, and follow the instructions. You must request within 7 days of receiving the item.",
  },
  {
    question: "When will I receive my refund?",
    answer:
      "Once we receive your return and verify the condition, refunds are issued within 5–7 business days to your original payment method.",
  },
  {
    question: "Which items are non-returnable?",
    answer:
      "Items like innerwear, swimwear, clearance items, and gift cards are non-returnable due to hygiene or policy restrictions.",
  },
  {
    question: "Can I exchange an item instead of a refund?",
    answer:
      "Yes! You can opt for an exchange if the item is available. Contact support within 48 hours of receiving your product.",
  },
  {
    question: "How do I contact support?",
    answer: (
      <>
        You can reach our support team via the{" "}
        <a
          href="/contact"
          className="text-rose-600 underline hover:text-rose-700"
        >
          Contact Us
        </a>{" "}
        page. We typically respond within 24 hours.
      </>
    ),
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 mt-16">
      <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = index === activeIndex;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl bg-white shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full px-5 py-4 text-left focus:outline-none"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-5 text-sm text-gray-600 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
