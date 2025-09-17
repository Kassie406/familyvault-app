import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Activity, Calendar, Users, Trophy, Clock, MapPin, Phone, FileText } from "lucide-react";

export default function SportsActivities() {
  const activityCategories = [
    {
      icon: Activity,
      title: "Sports Teams",
      description: "Team rosters, practice schedules, and game information",
      examples: ["Soccer team roster", "Practice: Tuesdays & Thursdays 4-6 PM", "Home games at Central Park", "Coach: Mike Johnson", "Team parent: Sarah Wilson"]
    },
    {
      icon: Trophy,
      title: "Competitions & Events",
      description: "Tournament schedules, registration deadlines, and results",
      examples: ["Regional tournament - March 15-17", "Registration deadline: February 1st", "Team photos: January 20th", "Awards banquet: April 5th", "End of season party"]
    },
    {
      icon: Users,
      title: "Coaches & Contacts",
      description: "Coach information, team parents, and activity coordinators",
      examples: ["Head Coach: Mike Johnson (555) 123-4567", "Assistant Coach: Lisa Brown", "Team Mom: Jennifer Davis", "League coordinator", "Equipment manager"]
    },
    {
      icon: FileText,
      title: "Forms & Documents",
      description: "Registration forms, medical clearances, and liability waivers",
      examples: ["Sports physical form", "Emergency medical form", "Photo/video release", "Transportation waiver", "Equipment agreement"]
    }
  ];

  const weeklySchedule = [
    { day: "Monday", activity: "Piano Lessons", time: "4:00 PM - 5:00 PM", location: "Music Academy", instructor: "Ms. Garcia" },
    { day: "Tuesday", activity: "Soccer Practice", time: "5:30 PM - 7:00 PM", location: "Central Park Field 2", instructor: "Coach Johnson" },
    { day: "Wednesday", activity: "Art Class", time: "3:30 PM - 4:30 PM", location: "Community Center", instructor: "Mr. Thompson" },
    { day: "Thursday", activity: "Soccer Practice", time: "5:30 PM - 7:00 PM", location: "Central Park Field 2", instructor: "Coach Johnson" },
    { day: "Saturday", activity: "Soccer Game", time: "10:00 AM - 12:00 PM", location: "Various Fields", instructor: "Coach Johnson" }
  ];

  const emergencyContacts = [
    { role: "Soccer Coach", name: "Mike Johnson", phone: "(555) 123-4567", email: "coach.johnson@youthsoccer.org" },
    { role: "Piano Instructor", name: "Ms. Garcia", phone: "(555) 234-5678", email: "garcia@musicacademy.com" },
    { role: "Art Teacher", name: "Mr. Thompson", phone: "(555) 345-6789", email: "thompson@communitycenter.org" },
    { role: "Team Parent", name: "Jennifer Davis", phone: "(555) 456-7890", email: "jdavis@email.com" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#0B0B0B] to-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.25)] mb-6">
              <Activity className="w-5 h-5" />
              Sports & Activities
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete Activity & Sports Management
            </h1>
            <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
              Keep track of sports teams, activity schedules, coach contacts, and important forms all in one organized place.
            </p>
          </div>
        </div>
      </section>

      {/* Activity Categories */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Everything You Need to Track
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activityCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="gold-card rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  </div>
                  
                  <p className="text-[#CCCCCC] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wide">Examples:</h4>
                    <ul className="space-y-2">
                      {category.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-[#CCCCCC] flex items-start">
                          <span className="text-[#D4AF37] mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Sample Weekly Activity Schedule
          </h2>
          
          <div className="gold-card rounded-2xl p-8">
            <div className="space-y-4">
              {weeklySchedule.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[rgba(212,175,55,0.05)] rounded-lg border border-[rgba(212,175,55,0.2)]">
                  <div className="flex items-center gap-4 mb-2 md:mb-0">
                    <div className="w-20 text-[#D4AF37] font-semibold">{item.day}</div>
                    <div>
                      <h4 className="text-white font-semibold">{item.activity}</h4>
                      <div className="flex items-center gap-4 text-sm text-[#CCCCCC]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[#D4AF37] font-medium">{item.instructor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coach & Instructor Contacts */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Coach & Instructor Directory
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="gold-card rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2">{contact.role}</h3>
                <p className="text-white font-semibold mb-4">{contact.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#CCCCCC]">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#CCCCCC]">{contact.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Never Miss a Game or Practice
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Schedule Reminders</h3>
              <p className="text-[#CCCCCC]">Get notifications for practices, games, and important activity deadlines.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Share with Caregivers</h3>
              <p className="text-[#CCCCCC]">Safely share activity information with grandparents, babysitters, and family members.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Location Tracking</h3>
              <p className="text-[#CCCCCC]">Keep track of multiple activity locations and get directions when needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Organize Your Family's Activities?
          </h2>
          <p className="text-xl text-[#CCCCCC] mb-8">
            Keep all sports schedules, coach contacts, and activity information organized in one place.
          </p>
          <a
            href="/signup"
            data-testid="button-get-started"
            className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C7A233] transition-colors inline-block"
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}