import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/admin-layout';
import { User, Mail, Shield, Calendar, Edit2, Save, X } from 'lucide-react';

export default function AdminProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: ''
  });

  // Fetch current user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/admin/profile'],
    queryFn: async () => {
      const response = await fetch('/api/admin/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    }
  });

  // Update form data when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || ''
      });
    }
  }, [user]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/profile'] });
    },
    onError: () => {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your admin account information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                data-testid="button-cancel-edit"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6 text-blue-600" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl font-bold">
                  {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user?.name || user?.username}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role || 'ADMIN'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    data-testid="input-name"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {user?.name || 'Not set'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    data-testid="input-email"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {user?.email || 'Not set'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                {isEditing ? (
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter your username"
                    data-testid="input-username"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {user?.username || 'Not set'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  {user?.role || 'ADMIN'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-green-600" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Last Updated</Label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}