import { useState } from 'react';
import { useManusAgent } from '@/hooks/useManusAgent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Bot, Send, User, Trash2, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ManusAssistantPanel() {
  const [prompt, setPrompt] = useState('');
  const { 
    askManus, 
    isLoading, 
    conversation, 
    clearConversation, 
    sessionId,
    conversationSummary 
  } = useManusAgent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    await askManus(prompt);
    setPrompt('');
  };

  const handleClearConversation = async () => {
    await clearConversation();
  };

  const quickActions = [
    'Audit our design system',
    'Add Sarah as a family member', 
    'Create a task to fix layout issues',
    'Track project progress'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black border-[#D4AF37]/20">
      <CardHeader className="border-b border-[#D4AF37]/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
            <Bot className="h-5 w-5" />
            Manus AI Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {conversationSummary}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearConversation}
              className="text-gray-400 hover:text-[#D4AF37]"
              data-testid="button-clear-conversation"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(action)}
                className="text-xs border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                data-testid={`button-quick-action-${i}`}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Manus AI anything..."
            className="flex-1 bg-gray-800 border-[#D4AF37]/30 text-white placeholder:text-gray-400"
            disabled={isLoading}
            data-testid="input-manus-prompt"
          />
          <Button 
            type="submit" 
            disabled={!prompt.trim() || isLoading}
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black"
            data-testid="button-send-prompt"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Conversation History */}
        {conversation.messages.length > 0 && (
          <div className="bg-gray-800 rounded-lg border border-[#D4AF37]/20">
            <div className="p-3 border-b border-[#D4AF37]/20">
              <p className="text-sm text-gray-300 font-medium">Conversation History</p>
            </div>
            <ScrollArea className="h-64 p-4">
              <div className="space-y-4">
                {conversation.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-[#D4AF37]/20' 
                          : 'bg-blue-600/20'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-[#D4AF37]" />
                        ) : (
                          <Bot className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div className={`space-y-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`px-3 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'bg-gray-700 text-white'
                        }`}>
                          <pre className="text-sm whitespace-pre-wrap font-sans">
                            {message.content}
                          </pre>
                        </div>
                        <p className="text-xs text-gray-500 px-1">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          {message.method && (
                            <span className="ml-2 text-[#D4AF37]">
                              • {message.method.replace(/_/g, ' ')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-[#D4AF37]" />
            <span className="ml-2 text-gray-400">Manus is thinking...</span>
          </div>
        )}
        
        {/* Empty State */}
        {conversation.messages.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <Bot className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <p className="text-lg font-medium">Start a conversation with Manus AI</p>
            <p className="text-sm">Ask me about design systems, project management, or family tasks!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}