import { ThreadsList } from "../components/ThreadsList";
import { MessageSquarePlus, Search, Settings } from "lucide-react";

export function ThreadsDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Family Messages
              </h1>
              <p className="text-gray-400">
                Stay connected with your family members
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-3 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-lg text-gold transition-colors">
                <MessageSquarePlus className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Conversations</p>
                <p className="text-2xl font-semibold text-white">
                  <span id="total-threads-count">-</span>
                </p>
              </div>
              <MessageSquarePlus className="w-8 h-8 text-gold/50" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unread Messages</p>
                <p className="text-2xl font-semibold text-white">
                  <span id="unread-messages-count">-</span>
                </p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Family Online</p>
                <p className="text-2xl font-semibold text-white">
                  <span id="online-members-count">-</span>
                </p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Threads List */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <ThreadsList />
        </div>

        {/* Demo Note */}
        <div className="mt-8 p-4 bg-gold/10 border border-gold/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-gold font-medium">Live Dashboard Demo</h3>
              <p className="text-gold/80 text-sm mt-1">
                This dashboard connects to your real threads API with presence tracking, 
                unread counts, and mark-as-read functionality. Try the search and click threads!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}