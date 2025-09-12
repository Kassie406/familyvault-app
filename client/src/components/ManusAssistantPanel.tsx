import { useState } from 'react';
import { useManusAgent } from '@/hooks/useManusAgent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Bot, Send } from 'lucide-react';

export default function ManusAssistantPanel() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const { askManus, isLoading } = useManusAgent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const result = await askManus(prompt);
    setResponse(result);
    setPrompt('');
  };

  const quickActions = [
    'Audit our design system',
    'Add Sarah as a family member', 
    'Create a task to fix layout issues',
    'Track project progress'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-black border-[#D4AF37]/20">
      <CardHeader className="border-b border-[#D4AF37]/20">
        <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
          <Bot className="h-5 w-5" />
          Manus AI Assistant
        </CardTitle>
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

        {/* Response Display */}
        {response && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-[#D4AF37]/20">
            <p className="text-sm text-gray-300 mb-2">Manus Response:</p>
            <pre className="text-sm text-white whitespace-pre-wrap overflow-x-auto" data-testid="text-manus-response">
              {response}
            </pre>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !response && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
            <span className="ml-2 text-gray-400">Manus is thinking...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}