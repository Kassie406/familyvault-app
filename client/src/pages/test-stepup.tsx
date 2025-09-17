import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { secureFetch } from '@/lib/step-up';
import { Shield, Download, Share, CreditCard } from 'lucide-react';

export default function TestStepUp() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const addResult = (action: string, success: boolean, data: any) => {
    const result = {
      id: Date.now(),
      action,
      success,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [result, ...prev]);
  };

  const testDownload = async () => {
    setLoading('download');
    try {
      const response = await secureFetch('/api/test-stepup/download/doc123');
      const data = await response.json();
      
      if (response.ok) {
        addResult('Download', true, data);
        toast({
          title: 'Download Authorized',
          description: data.message
        });
      } else {
        addResult('Download', false, data);
        toast({
          variant: 'destructive',
          title: 'Download Failed',
          description: data.error || 'Unknown error'
        });
      }
    } catch (error: any) {
      addResult('Download', false, { error: error.message });
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: error.message
      });
    } finally {
      setLoading(null);
    }
  };

  const testShare = async () => {
    setLoading('share');
    try {
      const response = await secureFetch('/api/test-stepup/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId: 'doc123',
          email: 'test@example.com'
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        addResult('Share', true, data);
        toast({
          title: 'Share Created',
          description: data.message
        });
      } else {
        addResult('Share', false, data);
        toast({
          variant: 'destructive',
          title: 'Share Failed',
          description: data.error || 'Unknown error'
        });
      }
    } catch (error: any) {
      addResult('Share', false, { error: error.message });
      toast({
        variant: 'destructive',
        title: 'Share Failed',
        description: error.message
      });
    } finally {
      setLoading(null);
    }
  };

  const testBilling = async () => {
    setLoading('billing');
    try {
      const response = await secureFetch('/api/test-stepup/billing/update-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardLast4: '4242'
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        addResult('Billing', true, data);
        toast({
          title: 'Card Updated',
          description: data.message
        });
      } else {
        addResult('Billing', false, data);
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: data.error || 'Unknown error'
        });
      }
    } catch (error: any) {
      addResult('Billing', false, { error: error.message });
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E7E7EA] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Step-Up Authentication Test</h1>
          <p className="text-[#A8A9AD]">
            Test the step-up authentication flow for protected actions. These endpoints require recent re-authentication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Actions */}
          <div className="space-y-6">
            <Card className="bg-[#141414] border-[#2A2B2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E7E7EA]">
                  <Shield className="h-5 w-5 text-[#D4AF37]" />
                  Protected Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#E7E7EA] mb-2 block">Document Download</Label>
                  <Button
                    onClick={testDownload}
                    disabled={loading === 'download'}
                    className="w-full bg-[#D4AF37] text-black hover:bg-[#B8941F]"
                    data-testid="test-download-button"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading === 'download' ? 'Testing...' : 'Test Download'}
                  </Button>
                  <p className="text-sm text-[#A8A9AD] mt-1">
                    Simulates downloading a protected document
                  </p>
                </div>

                <div>
                  <Label className="text-[#E7E7EA] mb-2 block">Document Sharing</Label>
                  <Button
                    onClick={testShare}
                    disabled={loading === 'share'}
                    className="w-full bg-[#D4AF37] text-black hover:bg-[#B8941F]"
                    data-testid="test-share-button"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    {loading === 'share' ? 'Testing...' : 'Test Share'}
                  </Button>
                  <p className="text-sm text-[#A8A9AD] mt-1">
                    Simulates sharing a document with another user
                  </p>
                </div>

                <div>
                  <Label className="text-[#E7E7EA] mb-2 block">Billing Update</Label>
                  <Button
                    onClick={testBilling}
                    disabled={loading === 'billing'}
                    className="w-full bg-[#D4AF37] text-black hover:bg-[#B8941F]"
                    data-testid="test-billing-button"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading === 'billing' ? 'Testing...' : 'Test Billing'}
                  </Button>
                  <p className="text-sm text-[#A8A9AD] mt-1">
                    Simulates updating payment information
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-[#2A2B2E]">
              <CardHeader>
                <CardTitle className="text-[#E7E7EA]">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#A8A9AD]">
                <div>
                  <strong className="text-[#E7E7EA]">1. Initial Request:</strong> Click any test button to make a request to a protected endpoint
                </div>
                <div>
                  <strong className="text-[#E7E7EA]">2. Re-auth Check:</strong> Server checks if you've recently authenticated (within 5 minutes)
                </div>
                <div>
                  <strong className="text-[#E7E7EA]">3. Step-Up Modal:</strong> If re-auth is needed, a modal appears automatically
                </div>
                <div>
                  <strong className="text-[#E7E7EA]">4. Verification:</strong> Use passkey or enter "123456" as TOTP code
                </div>
                <div>
                  <strong className="text-[#E7E7EA]">5. Retry:</strong> Original request is automatically retried after successful verification
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            <Card className="bg-[#141414] border-[#2A2B2E]">
              <CardHeader>
                <CardTitle className="text-[#E7E7EA]">Test Results</CardTitle>
                <Button
                  onClick={() => setResults([])}
                  variant="outline"
                  size="sm"
                  className="border-[#2A2B2E] text-[#A8A9AD] hover:bg-[#2A2B2E]"
                >
                  Clear Results
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.length === 0 ? (
                    <p className="text-[#A8A9AD] text-center py-8">
                      No test results yet. Try clicking one of the test buttons above.
                    </p>
                  ) : (
                    results.map((result) => (
                      <div
                        key={result.id}
                        className={`p-3 rounded border ${
                          result.success
                            ? 'border-green-800 bg-green-900/20'
                            : 'border-red-800 bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#E7E7EA]">
                            {result.action}
                          </span>
                          <span className="text-xs text-[#A8A9AD]">
                            {result.timestamp}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span
                            className={
                              result.success ? 'text-green-400' : 'text-red-400'
                            }
                          >
                            {result.success ? '✓ Success' : '✗ Failed'}
                          </span>
                          <div className="mt-1 text-[#A8A9AD] font-mono text-xs">
                            {JSON.stringify(result.data, null, 2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}