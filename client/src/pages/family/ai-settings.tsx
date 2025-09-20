import { useState } from 'react';
import { ArrowLeft, Bot, Bell, Shield, Brain, Zap, Save, AlertCircle, Settings } from 'lucide-react';
import { useLocation } from 'wouter';

interface AISettings {
  aiEnabled: boolean;
  smartSuggestions: boolean;
  autoAnalysis: boolean;
  notificationLevel: 'minimal' | 'standard' | 'detailed';
  dataProcessing: boolean;
  personalizedRecommendations: boolean;
  voiceInteraction: boolean;
  learningMode: boolean;
  privacyMode: boolean;
  analysisDepth: 'basic' | 'standard' | 'comprehensive';
  responseStyle: 'formal' | 'casual' | 'friendly';
}

export default function AISettings() {
  const [, setLocation] = useLocation();
  const [isModified, setIsModified] = useState(false);
  
  const [settings, setSettings] = useState<AISettings>({
    aiEnabled: true,
    smartSuggestions: true,
    autoAnalysis: false,
    notificationLevel: 'standard',
    dataProcessing: true,
    personalizedRecommendations: true,
    voiceInteraction: false,
    learningMode: true,
    privacyMode: false,
    analysisDepth: 'standard',
    responseStyle: 'friendly'
  });

  const handleSettingChange = (key: keyof AISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsModified(true);
  };

  const handleSaveSettings = () => {
    // TODO: Implement save logic
    console.log('Saving AI settings:', settings);
    setIsModified(false);
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all AI settings to defaults?')) {
      setSettings({
        aiEnabled: true,
        smartSuggestions: true,
        autoAnalysis: false,
        notificationLevel: 'standard',
        dataProcessing: true,
        personalizedRecommendations: true,
        voiceInteraction: false,
        learningMode: true,
        privacyMode: false,
        analysisDepth: 'standard',
        responseStyle: 'friendly'
      });
      setIsModified(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation('/family')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Bot className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AI Settings</h1>
                  <p className="text-sm text-gray-400">Configure AI features and preferences</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Reset to Defaults
              </button>
              {isModified && (
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* AI Status */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">AI Assistant Status</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Enable AI Assistant</h3>
              <p className="text-sm text-gray-400">Turn on AI-powered features and assistance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiEnabled}
                onChange={(e) => handleSettingChange('aiEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.aiEnabled && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium">AI Assistant is active</span>
              </div>
              <p className="text-sm text-gray-300">Your AI assistant is ready to help with document analysis, suggestions, and family organization.</p>
            </div>
          )}
        </div>

        {/* Core AI Features */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Core AI Features</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Smart Suggestions</h3>
                <p className="text-sm text-gray-400">Get intelligent recommendations for organizing your family data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smartSuggestions}
                  onChange={(e) => handleSettingChange('smartSuggestions', e.target.checked)}
                  disabled={!settings.aiEnabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Automatic Analysis</h3>
                <p className="text-sm text-gray-400">Automatically analyze uploaded documents and photos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoAnalysis}
                  onChange={(e) => handleSettingChange('autoAnalysis', e.target.checked)}
                  disabled={!settings.aiEnabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Personalized Recommendations</h3>
                <p className="text-sm text-gray-400">Receive recommendations tailored to your family's needs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.personalizedRecommendations}
                  onChange={(e) => handleSettingChange('personalizedRecommendations', e.target.checked)}
                  disabled={!settings.aiEnabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Learning Mode</h3>
                <p className="text-sm text-gray-400">Allow AI to learn from your preferences and improve over time</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.learningMode}
                  onChange={(e) => handleSettingChange('learningMode', e.target.checked)}
                  disabled={!settings.aiEnabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>
          </div>
        </div>

        {/* AI Behavior */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">AI Behavior</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Analysis Depth</label>
              <select
                value={settings.analysisDepth}
                onChange={(e) => handleSettingChange('analysisDepth', e.target.value)}
                disabled={!settings.aiEnabled}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="basic">Basic - Quick overview</option>
                <option value="standard">Standard - Balanced analysis</option>
                <option value="comprehensive">Comprehensive - Detailed insights</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Response Style</label>
              <select
                value={settings.responseStyle}
                onChange={(e) => handleSettingChange('responseStyle', e.target.value)}
                disabled={!settings.aiEnabled}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="formal">Formal - Professional tone</option>
                <option value="casual">Casual - Relaxed communication</option>
                <option value="friendly">Friendly - Warm and helpful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">AI Notifications</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notification Level</label>
              <select
                value={settings.notificationLevel}
                onChange={(e) => handleSettingChange('notificationLevel', e.target.value)}
                disabled={!settings.aiEnabled}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="minimal">Minimal - Only critical insights</option>
                <option value="standard">Standard - Important findings</option>
                <option value="detailed">Detailed - All AI activities</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-medium text-white mb-2">Minimal</h4>
                <p className="text-sm text-gray-400">Only urgent or critical AI insights</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-medium text-white mb-2">Standard</h4>
                <p className="text-sm text-gray-400">Important findings and suggestions</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-medium text-white mb-2">Detailed</h4>
                <p className="text-sm text-gray-400">All AI activities and minor insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Privacy & Data Processing</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Data Processing</h3>
                <p className="text-sm text-gray-400">Allow AI to process your family data for insights</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dataProcessing}
                  onChange={(e) => handleSettingChange('dataProcessing', e.target.checked)}
                  disabled={!settings.aiEnabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Privacy Mode</h3>
                <p className="text-sm text-gray-400">Enhanced privacy with local processing only</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacyMode}
                  onChange={(e) => handleSettingChange('privacyMode', e.target.checked)}
                  disabled={!settings.aiEnabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>

            {settings.privacyMode && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Privacy Mode Active</span>
                </div>
                <p className="text-sm text-gray-300">
                  AI processing is limited to your device. Some features may be reduced or unavailable.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Advanced Features</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Voice Interaction</h3>
                <p className="text-sm text-gray-400">Enable voice commands and responses (Coming Soon)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voiceInteraction}
                  onChange={(e) => handleSettingChange('voiceInteraction', e.target.checked)}
                  disabled={true} // Disabled for now
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-medium text-white mb-2">AI Usage Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Documents Analyzed</p>
                  <p className="text-white font-medium">127</p>
                </div>
                <div>
                  <p className="text-gray-400">Suggestions Made</p>
                  <p className="text-white font-medium">43</p>
                </div>
                <div>
                  <p className="text-gray-400">Time Saved</p>
                  <p className="text-white font-medium">2.5 hrs</p>
                </div>
                <div>
                  <p className="text-gray-400">Accuracy Rate</p>
                  <p className="text-white font-medium">94%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
