// components/HomePage/FAQSection.tsx
"use client";
import React, { useState } from 'react';
import { ChevronDownIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FAQ data structure
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// Seminary FAQ data
const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "What programs does Holy Spirit Major Seminary offer?",
    answer: "Holy Spirit Major Seminary offers comprehensive programs in Theology and Philosophy. Our theology program includes biblical studies, systematic theology, moral theology, and pastoral studies. The philosophy program covers metaphysics, ethics, epistemology, and the history of philosophy, all grounded in both Western and Eastern philosophical traditions."
  },
  {
    id: 2,
    question: "When was Holy Spirit Major Seminary established?",
    answer: "Holy Spirit Major Seminary was established in 1973 to serve the Church in Bangladesh by forming priests and religious leaders through rigorous theological and philosophical education."
  },
  {
    id: 3,
    question: "Are the degrees from Holy Spirit Major Seminary internationally recognized?",
    answer: "Yes, our degrees are recognized internationally. Holy Spirit Major Seminary is affiliated with the Pontifical Urban University in Rome, ensuring that our theological and philosophical degrees meet global academic standards."
  },
  {
    id: 4,
    question: "Does the seminary accept lay students?",
    answer: "Yes, while our primary mission is the formation of priests, Holy Spirit Major Seminary welcomes lay students who wish to deepen their theological and philosophical knowledge. We offer special programs and courses tailored for lay ministers, catechists, and those interested in advanced religious studies."
  },
  {
    id: 5,
    question: "How does the seminary engage with the multireligious context of Bangladesh?",
    answer: "We place special emphasis on interreligious dialogue, particularly with Islam, Hinduism, and Buddhism. Our curriculum includes comparative religious studies and practical experience in interreligious engagement, preparing our students to serve effectively in Bangladesh's diverse religious landscape."
  },
  {
    id: 6,
    question: "What is the language of instruction at Holy Spirit Major Seminary?",
    answer: "Our primary language of instruction is English, with supplementary materials in Bengali. We also offer courses in Latin, Greek, and Hebrew for biblical and theological studies. Students are required to develop proficiency in Bengali for pastoral work in local communities."
  },
  {
    id: 7,
    question: "How can I apply to Holy Spirit Major Seminary?",
    answer: "Prospective students should contact our Admissions Office for application requirements. Seminarians are typically sponsored by their diocese or religious congregation, while lay students can apply directly. Applications require academic transcripts, letters of recommendation, and an interview with our admissions committee."
  }
];

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  toggleAccordion: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, toggleAccordion }) => {
  return (
    <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100 hover:border-blue-100 transition-all duration-200">
      <button
        className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900">{item.question}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          {isOpen ? <MinusIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-gray-100 px-5 py-4 text-gray-600">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const [openItemId, setOpenItemId] = useState<number | null>(1); // First item open by default

  const toggleAccordion = (id: number) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto h-1.5 w-16 rounded-full bg-blue-600 mb-6"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Find answers to common questions about Holy Spirit Major Seminary and our theological and philosophical programs
          </p>
        </div>
        
        <div className="space-y-4">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openItemId === item.id}
              toggleAccordion={() => toggleAccordion(item.id)}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="mb-5 text-gray-600">Have additional questions about our seminary?</p>
          <a 
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;