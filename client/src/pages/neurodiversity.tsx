import Navbar from "@/components/navbar";
import { Brain, Heart, Users, FileText, Star, Shield, BookOpen, CheckCircle } from "lucide-react";

export default function Neurodiversity() {
  const supportCategories = [
    {
      title: "Medical & Therapeutic Records",
      icon: Heart,
      items: [
        "Diagnostic evaluations and reports",
        "IEP and 504 plan documents",
        "Therapy session notes and progress",
        "Medication records and prescriptions",
        "Specialist contact information",
        "Insurance authorization forms"
      ]
    },
    {
      title: "Educational Support",
      icon: BookOpen,
      items: [
        "School accommodation plans",
        "Educational assessments",
        "Teacher communication logs",
        "Academic progress reports",
        "Transition planning documents",
        "Special education rights information"
      ]
    },
    {
      title: "Daily Living Resources",
      icon: Star,
      items: [
        "Communication aids and tools",
        "Sensory support strategies",
        "Daily routine schedules",
        "Behavioral support plans",
        "Safety protocols and emergency plans",
        "Community resource contacts"
      ]
    },
    {
      title: "Legal & Advocacy",
      icon: Shield,
      items: [
        "Disability rights documentation",
        "Guardianship or conservatorship papers",
        "ABLE account information",
        "Social Security benefits records",
        "Advocacy organization contacts",
        "Legal representation information"
      ]
    }
  ];

  const lifeStageSupport = [
    {
      stage: "Early Childhood (0-5)",
      focus: "Early Intervention & Development",
      priorities: [
        "Early intervention services",
        "Developmental milestone tracking",
        "Speech and occupational therapy",
        "Family support resources"
      ]
    },
    {
      stage: "School Age (6-17)",
      focus: "Educational Support & Growth",
      priorities: [
        "IEP/504 plan development",
        "Academic accommodations",
        "Social skills development",
        "Transition planning preparation"
      ]
    },
    {
      stage: "Young Adult (18-25)",
      focus: "Independence & Transition",
      priorities: [
        "Higher education supports",
        "Vocational training programs",
        "Independent living skills",
        "Self-advocacy development"
      ]
    },
    {
      stage: "Adult (26+)",
      focus: "Long-term Support & Planning",
      priorities: [
        "Employment accommodations",
        "Housing and living arrangements",
        "Healthcare coordination",
        "Estate and future planning"
      ]
    }
  ];

  const supportStrategies = [
    {
      title: "Create Consistent Routines",
      description: "Establish predictable daily schedules and routines that provide structure and reduce anxiety. Document what works best."
    },
    {
      title: "Build Support Networks",
      description: "Connect with other families, support groups, and community organizations that understand neurodiversity."
    },
    {
      title: "Advocate for Rights",
      description: "Learn about disability rights and laws, and maintain documentation to ensure appropriate accommodations and services."
    },
    {
      title: "Focus on Strengths",
      description: "Identify and nurture individual strengths, interests, and talents while addressing areas of need."
    },
    {
      title: "Prepare for Transitions",
      description: "Plan carefully for major life transitions with advance preparation, documentation, and support systems."
    },
    {
      title: "Maintain Comprehensive Records",
      description: "Keep detailed records of assessments, treatments, accommodations, and what strategies work best."
    }
  ];

  const resources = [
    {
      category: "Autism Resources",
      organizations: [
        "Autistic Self Advocacy Network",
        "Autism Society of America", 
        "Association for Behavior Analysis International"
      ]
    },
    {
      category: "ADHD Support",
      organizations: [
        "Children and Adults with ADHD (CHADD)",
        "ADHD Foundation",
        "Attention Deficit Disorder Association"
      ]
    },
    {
      category: "Learning Differences",
      organizations: [
        "Learning Disabilities Association",
        "International Dyslexia Association",
        "National Center for Learning Disabilities"
      ]
    },
    {
      category: "General Support",
      organizations: [
        "Disability Rights Education & Defense Fund",
        "Arc of the United States",
        "United Spinal Association"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Neurodiversity Support & Resources
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Organize essential documentation and resources to support neurodivergent family members. 
            Create comprehensive records that help ensure proper care, accommodations, and advocacy throughout life.
          </p>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Support Documentation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Keep these important areas organized to ensure comprehensive support and advocacy for neurodivergent family members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {supportCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Life Stage Support */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Life Stage Support Planning</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Different life stages require different types of support and documentation for neurodivergent individuals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lifeStageSupport.map((stage, index) => (
              <div key={index} className="bg-teal-500 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">{stage.stage}</h3>
                <p className="text-teal-200 text-sm mb-4 font-medium">{stage.focus}</p>
                <ul className="space-y-2">
                  {stage.priorities.map((priority, priorityIndex) => (
                    <li key={priorityIndex} className="text-teal-100 text-sm leading-relaxed">
                      • {priority}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Strategies */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Star className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Effective Support Strategies</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proven approaches to supporting neurodivergent family members and advocating for their needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportStrategies.map((strategy, index) => (
              <div key={index} className="bg-teal-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{strategy.title}</h3>
                <p className="text-gray-700 leading-relaxed">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FileText className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Helpful Organizations & Resources</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with these organizations for support, advocacy, and resources
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resourceGroup, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{resourceGroup.category}</h3>
                <ul className="space-y-2">
                  {resourceGroup.organizations.map((org, orgIndex) => (
                    <li key={orgIndex} className="text-sm text-gray-700 leading-relaxed">
                      • {org}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">1 in 44</div>
              <p className="text-gray-700">children diagnosed with autism spectrum disorder</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">11%</div>
              <p className="text-gray-700">of school-age children have ADHD</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">15-20%</div>
              <p className="text-gray-700">of population has a learning difference</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Support Your Neurodivergent Family Member's Journey
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Keep all important documentation, resources, and support information organized and accessible for effective advocacy.
          </p>
          <a
            href="/signup"
            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Organize Support Information
          </a>
        </div>
      </section>
    </div>
  );
}