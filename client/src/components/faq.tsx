import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long has FamilyCircle Secure been in business?",
    answer: "FamilyCircle Secure has helped thousands of families stay organized and secure since 2020, ensuring they're prepared for all of life's important moments."
  },
  {
    question: "What happens to my information if I stop subscribing to FamilyCircle Secure?",
    answer: "You will be able to securely export your information, keeping your documents safe and accessible."
  },
  {
    question: "How does FamilyCircle Secure's digital vault compare to other solutions?",
    answer: "We've seen families build DIY solutions to keep track of their important family information using the analog and digital tools at hand, from a stack of paper on their desk to Excel spreadsheets and more. We tried using these systems and found that all the off-the-shelf solutions fell short in the same areas: 1. Start with a blank page, which can be debilitating for many. 2. Didn't offer guidance in getting everything set up. 3. Didn't offer automation, meaning you have to do everything manually. The Family Operating System® solves all of these and more. Start your own Family Operating System® today."
  },
  {
    question: "Is FamilyCircle Secure secure?",
    answer: "FamilyCircle Secure deploys world-class security measures – data encryption, multi-factor authentication, tokenization, threat detection, stolen-password alerts, and biometric authentication – to ensure your family's information remains private and protected. In fact, your information is safer with FamilyCircle Secure than in a filing cabinet at home, where documents may be vulnerable to loss, damage, or theft."
  },
  {
    question: "How much does FamilyCircle Secure cost?",
    answer: "FamilyCircle Secure offers 3 pricing tiers, starting with free. Visit our pricing page to learn more about our plans and find the one that's right for your family."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#111111] py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item rounded-xl">
              <button
                data-testid={`faq-toggle-${index + 1}`}
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-6 flex justify-between items-center hover:bg-[#111111] transition-colors"
              >
                <span className="text-lg font-semibold text-[#D4AF37]">{faq.question}</span>
                <ChevronDown 
                  className={`w-6 h-6 text-[#CCCCCC] transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div 
                  data-testid={`faq-content-${index + 1}`}
                  className="px-6 pb-6 faq-content"
                >
                  <p className="text-[#CCCCCC]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
