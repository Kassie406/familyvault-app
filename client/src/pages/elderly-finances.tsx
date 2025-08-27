import { DollarSign, CreditCard, FileText, Shield, PiggyBank, TrendingUp } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ElderlyFinances() {
  const financialCategories = [
    {
      icon: CreditCard,
      title: "Bank Accounts & Cards",
      description: "Checking, savings, credit cards, and account information",
      fields: ["Checking Accounts", "Savings Accounts", "Credit Cards", "Account Numbers & Routing"]
    },
    {
      icon: Shield,
      title: "Insurance Policies",
      description: "Life, health, disability, and long-term care insurance",
      fields: ["Life Insurance", "Health Insurance", "Disability Insurance", "Long-term Care Insurance"]
    },
    {
      icon: TrendingUp,
      title: "Investments & Retirement",
      description: "401k, IRA, pensions, and investment accounts",
      fields: ["401k/403b Accounts", "IRA Accounts", "Pension Information", "Investment Portfolios"]
    },
    {
      icon: FileText,
      title: "Important Financial Documents",
      description: "Tax returns, social security, and financial statements",
      fields: ["Tax Returns", "Social Security Info", "Financial Statements", "Income Documentation"]
    },
    {
      icon: PiggyBank,
      title: "Benefits & Entitlements",
      description: "Medicare, Social Security, and government benefits",
      fields: ["Medicare Information", "Social Security Benefits", "Veterans Benefits", "Government Assistance"]
    },
    {
      icon: DollarSign,
      title: "Bills & Expenses",
      description: "Monthly bills, utilities, and recurring expenses",
      fields: ["Monthly Bills", "Utility Accounts", "Recurring Expenses", "Payment Schedules"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#121212] to-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full px-4 py-2 mb-6">
              <DollarSign className="w-4 h-4 text-[#FFD43B] mr-2" />
              <span className="text-[#FFD43B] text-sm font-medium">Financial Organization for Elderly Parents</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Organize Financial Information for Elderly Parents
            </h1>
            
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Securely manage your elderly parents' financial information, from bank accounts to insurance policies. Ensure their financial affairs are organized and accessible when needed.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-get-started"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Organizing Finances
            </a>
            <a
              href="/elderly-parents"
              data-testid="button-back-elder-care"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-3 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              Back to Elder Care
            </a>
          </div>
        </div>
      </section>

      {/* Financial Categories */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Complete Financial Information Management
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Organize every aspect of your elderly parents' financial life in one secure, accessible location.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {financialCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  data-testid={`financial-category-${index + 1}`}
                  className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#FFD43B]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#FFD43B]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                  <p className="text-[#A5A5A5] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#FFD43B] mb-3">Key Information to Store:</h4>
                    <ul className="space-y-2">
                      {category.fields.map((field, fieldIndex) => (
                        <li key={fieldIndex} className="flex items-center text-sm text-[#CCCCCC]">
                          <div className="w-1.5 h-1.5 bg-[#FFD43B] rounded-full mr-3"></div>
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    data-testid={`button-add-${category.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                    className="w-full mt-6 bg-[#FFD43B] text-[#0E0E0E] font-semibold py-3 rounded-lg hover:bg-[#E6C140] transition-colors flex items-center justify-center"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Add {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <Shield className="w-16 h-16 text-[#FFD43B] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Bank-Level Security for Financial Information
            </h2>
            <p className="text-[#A5A5A5] mb-6 leading-relaxed">
              Your elderly parents' financial information is protected with the same security standards used by major financial institutions. All data is encrypted end-to-end and stored in secure, HIPAA-compliant facilities.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                <h4 className="text-[#FFD43B] font-medium mb-2">256-bit Encryption</h4>
                <p className="text-[#A5A5A5]">Military-grade encryption protects all financial data</p>
              </div>
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                <h4 className="text-[#FFD43B] font-medium mb-2">SOC 2 Certified</h4>
                <p className="text-[#A5A5A5]">Independently verified security controls and procedures</p>
              </div>
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                <h4 className="text-[#FFD43B] font-medium mb-2">Zero-Knowledge</h4>
                <p className="text-[#A5A5A5]">Only you and authorized family members can access the information</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Take Control of Financial Organization
          </h2>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Help your elderly parents stay financially organized and secure with FamilyVault's comprehensive platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-start-organizing"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Organizing Financial Information
            </a>
            <a
              href="/schedule-demo"
              data-testid="button-schedule-demo"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-4 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}