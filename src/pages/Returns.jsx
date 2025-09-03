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

const Returns = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-gray-800 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Returns & Exchanges</h1>

      <div className="space-y-6 text-base leading-relaxed text-gray-700">
        <p>
          We want you to love what you ordered. If something isn't right, let us know. We accept returns within 7 days of receiving the product. Items must be unworn, unwashed, and in original packaging.
        </p>
        <p>
          Products eligible for return must be in their original condition. Once inspected, we will initiate a refund or exchange as per your request.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Request return within 7 days of delivery.</li>
          <li>Refunds processed to original payment method within 5–7 business days.</li>
          <li>Shipping charges are non-refundable.</li>
          <li>Customized or final-sale items are non-returnable.</li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
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
    </div>
  );
};

export default Returns;
