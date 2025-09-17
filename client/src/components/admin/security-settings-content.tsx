import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Key, Plus, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface SecuritySettingsContentProps {
  onSwitchToAuditTab?: () => void;
}

export default function SecuritySettingsContent({ onSwitchToAuditTab }: SecuritySettingsContentProps) {
  const [, navigate] = useLocation();

  const handleAddPasskey = () => {
    // Navigate to passkey setup or show setup modal
    console.log('Add passkey clicked - Setting up device passkey authentication');
    // For now, could navigate to a dedicated passkey setup page
    // navigate('/admin/security/passkey-setup');
  };

  const handleSetupPasskey = () => {
    // Same as add passkey
    handleAddPasskey();
  };

  const handleEnableTwoFA = () => {
    // Navigate to 2FA setup
    console.log('Enable 2FA clicked - Setting up two-factor authentication');
    // navigate('/admin/security/two-factor-setup');
  };

  const handleReviewSessions = () => {
    // Switch back to Security & Audit tab to show session management
    console.log('Review sessions clicked - Switching to Security & Audit tab');
    if (onSwitchToAuditTab) {
      onSwitchToAuditTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Passkeys Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Key className="h-6 w-6 text-yellow-600" />
            Passkeys
            <span className="section-subtitle text-sm font-normal">
              Use device passkeys for stronger, phishing-resistant sign-in.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center flex-1">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">You don't have any passkeys yet.</h3>
              <p className="text-gray-600">Add a passkey to sign in securely with Face ID, Touch ID, or a security key.</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleAddPasskey}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              data-testid="button-add-passkey"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add passkey
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About Passkeys */}
      <Card>
        <CardHeader>
          <CardTitle>About Passkeys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900">Phishing Resistant</h4>
              <p className="text-green-800 text-sm">Passkeys can't be phished or stolen in data breaches because they never leave your device.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Key className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Device Biometrics</h4>
              <p className="text-blue-800 text-sm">Use Face ID, Touch ID, Windows Hello, or other device authentication methods.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
            <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900">Backup & Sync</h4>
              <p className="text-purple-800 text-sm">Passkeys can sync across your devices or stay device-specific for maximum security.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Add a passkey</h4>
                <p className="text-sm text-gray-600">Set up device biometric authentication for secure access</p>
              </div>
              <Button 
                onClick={handleSetupPasskey}
                variant="outline" 
                size="sm"
                data-testid="button-setup-passkey"
              >
                Set up
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security with TOTP codes</p>
              </div>
              <Button 
                onClick={handleEnableTwoFA}
                variant="outline" 
                size="sm"
                data-testid="button-enable-2fa"
              >
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Review Active Sessions</h4>
                <p className="text-sm text-gray-600">Check devices that have access to your account</p>
              </div>
              <Button 
                onClick={handleReviewSessions}
                variant="outline" 
                size="sm"
                data-testid="button-review-sessions"
              >
                Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}