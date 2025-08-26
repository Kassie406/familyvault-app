import insuranceRecoveryImage from "@assets/generated_images/Family_with_insurance_recovery_documents_649fad52.png";

export default function CustomerStory() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Video */}
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                After the Wildfire Crisis, FamilyVault Became a Family's Lifeline
              </h2>
              <p className="text-lg text-gray-600">
                FamilyVault helped Jeremy W.'s family navigate the trauma of losing their home to a wildfire — and gave them the tools to start their recovery.
              </p>
            </div>
            
            <img 
              src={insuranceRecoveryImage} 
              alt="Family working with insurance recovery documents and emergency planning materials" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
          </div>

          {/* Right Column - Quote */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <blockquote 
              data-testid="text-customer-quote"
              className="text-xl text-gray-700 mb-6 italic"
            >
              "I was able to start recovery efforts immediately without scrambling to replace paperwork or remember what we lost. As tragic as this situation was, FamilyVault made the process so much easier. It gave us a head start when we needed it the most."
            </blockquote>
            <div className="border-t pt-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JW</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jeremy W.</p>
                  <p className="text-gray-600 text-sm">FamilyVault member since 2022</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
