import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { secureFetch } from '@/lib/step-up';
import { Shield, Download, Share, CreditCard, Info } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminStepUpTest() {
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
    <AdminLayout activeSection="stepup-test">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Step-Up Authentication Test</h1>
            <p className="text-gray-600 mt-2">Test the step-up authentication flow for protected actions. These endpoints require recent re-authentication.</p>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This testing interface demonstrates the step-up authentication flow. When you click a test button, the system will check if you've recently authenticated. If not, a security modal will appear automatically.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Test Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  Protected Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Document Download</h4>
                  <Button
                    onClick={testDownload}
                    disabled={loading === 'download'}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    data-testid="admin-test-download-button"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading === 'download' ? 'Testing...' : 'Test Download'}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Simulates downloading a protected document
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Document Sharing</h4>
                  <Button
                    onClick={testShare}
                    disabled={loading === 'share'}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    data-testid="admin-test-share-button"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    {loading === 'share' ? 'Testing...' : 'Test Share'}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Simulates sharing a document with another user
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Billing Update</h4>
                  <Button
                    onClick={testBilling}
                    disabled={loading === 'billing'}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    data-testid="admin-test-billing-button"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading === 'billing' ? 'Testing...' : 'Test Billing'}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Simulates updating payment information
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="border-l-4 border-blue-500 pl-4">
                  <strong className="text-gray-900">1. Initial Request:</strong>
                  <p className="text-gray-600">Click any test button to make a request to a protected endpoint</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <strong className="text-gray-900">2. Re-auth Check:</strong>
                  <p className="text-gray-600">Server checks if you've recently authenticated (within 5 minutes)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <strong className="text-gray-900">3. Step-Up Modal:</strong>
                  <p className="text-gray-600">If re-auth is needed, a modal appears automatically</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <strong className="text-gray-900">4. Verification:</strong>
                  <p className="text-gray-600">Use passkey or enter "123456" as TOTP code</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <strong className="text-gray-900">5. Retry:</strong>
                  <p className="text-gray-600">Original request is automatically retried after successful verification</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Test Results</CardTitle>
                <Button
                  onClick={() => setResults([])}
                  variant="outline"
                  size="sm"
                >
                  Clear Results
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No test results yet.</p>
                      <p className="text-sm">Try clicking one of the test buttons to see the step-up flow in action.</p>
                    </div>
                  ) : (
                    results.map((result) => (
                      <div
                        key={result.id}
                        className={`p-4 rounded-lg border ${
                          result.success
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {result.action}
                          </span>
                          <span className="text-xs text-gray-500">
                            {result.timestamp}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span
                            className={
                              result.success ? 'text-green-700 font-medium' : 'text-red-700 font-medium'
                            }
                          >
                            {result.success ? '✓ Success' : '✗ Failed'}
                          </span>
                          <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700">
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
    </AdminLayout>
  );
}