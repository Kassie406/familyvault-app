import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long has FamilyVault been in business?",
    answer: "FamilyVault has helped thousands of families stay organized and secure since 2020, ensuring they're prepared for all of life's important moments."
  },
  {
    question: "What happens to my information if I stop subscribing to FamilyVault?",
    answer: "You will be able to securely export your information, keeping your documents safe and accessible."
  },
  {
    question: "How does FamilyVault's digital vault compare to other solutions?",
    answer: "We've seen families build DIY solutions to keep track of their important family information using the analog and digital tools at hand, from a stack of paper on their desk to Excel spreadsheets and more. We tried using these systems and found that all the off-the-shelf solutions fell short in the same areas: 1. Start with a blank page, which can be debilitating for many. 2. Didn't offer guidance in getting everything set up. 3. Didn't offer automation, meaning you have to do everything manually. The Family Operating System® solves all of these and more. Start your own Family Operating System® today."
  },
  {
    question: "Is FamilyVault secure?",
    answer: "FamilyVault deploys world-class security measures – data encryption, multi-factor authentication, tokenization, threat detection, stolen-password alerts, and biometric authentication – to ensure your family's information remains private and protected. In fact, your information is safer with FamilyVault than in a filing cabinet at home, where documents may be vulnerable to loss, damage, or theft."
  },
  {
    question: "How much does FamilyVault cost?",
    answer: "FamilyVault offers 3 pricing tiers, starting with free. Visit our pricing page to learn more about our plans and find the one that's right for your family."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl">
              <button
                data-testid={`faq-toggle-${index + 1}`}
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown 
                  className={`w-6 h-6 text-gray-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div 
                  data-testid={`faq-content-${index + 1}`}
                  className="px-6 pb-6 faq-content"
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
