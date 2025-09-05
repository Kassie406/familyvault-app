import { Link } from 'wouter';
import { Settings, Users, Shield, Key, Mail, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FamilySettings() {
  return (
    <div className="min-h-screen bg-[var(--bg-900)] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/family" className="inline-flex items-center text-[var(--gold)] hover:text-[var(--gold)]/80 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Family Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Family Settings</h1>
          <p className="text-[var(--ink-300)]">Manage family member roles, access permissions, and security settings.</p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Roles & Access */}
          <Card className="border-[var(--line-700)] bg-[var(--bg-850)]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="h-5 w-5 text-[var(--gold)] mr-3" />
                Roles & Access
              </CardTitle>
              <CardDescription className="text-[var(--ink-300)]">
                Manage family member roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ink-300)] mb-4">
                Control who can view, edit, and manage family information. Set different permission levels for family members.
              </p>
              <Button variant="outline" className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">
                Manage Permissions
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-[var(--line-700)] bg-[var(--bg-850)]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="h-5 w-5 text-[var(--gold)] mr-3" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-[var(--ink-300)]">
                Configure family security and privacy options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ink-300)] mb-4">
                Set up two-factor authentication, session timeouts, and other security measures for your family portal.
              </p>
              <Link href="/settings">
                <Button variant="outline" className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">
                  Security Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Family Invitations */}
          <Card className="border-[var(--line-700)] bg-[var(--bg-850)]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Mail className="h-5 w-5 text-[var(--gold)] mr-3" />
                Invitations
              </CardTitle>
              <CardDescription className="text-[var(--ink-300)]">
                Manage pending and sent family member invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ink-300)] mb-4">
                View and manage pending invitations, resend invites, or revoke access for family members.
              </p>
              <Button variant="outline" className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">
                View Invitations
              </Button>
            </CardContent>
          </Card>

          {/* Password Management */}
          <Card className="border-[var(--line-700)] bg-[var(--bg-850)]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Key className="h-5 w-5 text-[var(--gold)] mr-3" />
                Password Policies
              </CardTitle>
              <CardDescription className="text-[var(--ink-300)]">
                Set family password requirements and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ink-300)] mb-4">
                Configure password strength requirements and enable family-wide security policies.
              </p>
              <Button variant="outline" className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">
                Password Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}