import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, Search, Edit, Trash2, Mail, Phone, Crown, Shield, User, Lock, Unlock, RotateCcw, Send, Eye, Settings, Clock, AlertTriangle, CheckCircle, Key, UserPlus, MoreVertical, Filter, Download, X } from 'lucide-react';
import { useLocation } from 'wouter';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'main_admin' | 'co_admin' | 'parent' | 'child' | 'grandparent' | 'guardian';
  avatar: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  joinedDate: string;
  lastLogin?: string;
  hasLogin: boolean;
  canAdmin: boolean;
  permissions: string[];
  accountLocked: boolean;
  inviteSent: boolean;
  relationship: string;
  customLabel?: string;
}

interface InviteModalData {
  name: string;
  email: string;
  relationship: string;
  role: FamilyMember['role'];
  createLogin: boolean;
  tempPassword: string;
  sendInvite: boolean;
}

interface LoginSettingsModal {
  isOpen: boolean;
  memberId: string | null;
}

interface RolePermissionsModal {
  isOpen: boolean;
  memberId: string | null;
}

export default function ManageFamilyMembers() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loginSettingsModal, setLoginSettingsModal] = useState<LoginSettingsModal>({ isOpen: false, memberId: null });
  const [rolePermissionsModal, setRolePermissionsModal] = useState<RolePermissionsModal>({ isOpen: false, memberId: null });
  
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Kassie Cooper',
      email: 'kassie@familyvault.com',
      phone: '+1 (555) 123-4567',
      role: 'main_admin',
      avatar: '',
      status: 'active',
      joinedDate: '2024-01-15',
      lastLogin: '2024-01-29 14:30',
      hasLogin: true,
      canAdmin: true,
      permissions: ['all'],
      accountLocked: false,
      inviteSent: false,
      relationship: 'Self'
    },
    {
      id: '2',
      name: 'John Cooper',
      email: 'john@familyvault.com',
      phone: '+1 (555) 123-4568',
      role: 'co_admin',
      avatar: '',
      status: 'active',
      joinedDate: '2024-01-15',
      lastLogin: '2024-01-28 09:15',
      hasLogin: true,
      canAdmin: false,
      permissions: ['view_calendar', 'edit_budget', 'assign_chores'],
      accountLocked: false,
      inviteSent: false,
      relationship: 'Husband'
    },
    {
      id: '3',
      name: 'Emma Cooper',
      email: 'emma@familyvault.com',
      phone: '+1 (555) 123-4569',
      role: 'child',
      avatar: '',
      status: 'active',
      joinedDate: '2024-02-01',
      lastLogin: '2024-01-27 16:45',
      hasLogin: true,
      canAdmin: false,
      permissions: ['view_chores', 'view_calendar'],
      accountLocked: false,
      inviteSent: false,
      relationship: 'Daughter'
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '+1 (555) 987-6543',
      role: 'grandparent',
      avatar: '',
      status: 'pending',
      joinedDate: '2024-03-10',
      hasLogin: false,
      canAdmin: false,
      permissions: ['view_docs', 'view_calendar'],
      accountLocked: false,
      inviteSent: true,
      relationship: 'Grandmother'
    }
  ]);

  const [inviteData, setInviteData] = useState<InviteModalData>({
    name: '',
    email: '',
    relationship: '',
    role: 'child',
    createLogin: true,
    tempPassword: '',
    sendInvite: true
  });

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: FamilyMember['role']) => {
    switch (role) {
      case 'main_admin': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'co_admin': return <Crown className="h-4 w-4 text-orange-400" />;
      case 'parent': return <Shield className="h-4 w-4 text-blue-400" />;
      case 'grandparent': return <Shield className="h-4 w-4 text-purple-400" />;
      case 'guardian': return <Shield className="h-4 w-4 text-green-400" />;
      case 'child': return <User className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: FamilyMember['status']) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">🟢 Active</span>;
      case 'pending': return <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">🟡 Pending Invite</span>;
      case 'suspended': return <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">🔴 Suspended</span>;
      case 'inactive': return <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded-full">⚫ Inactive</span>;
    }
  };

  const getRoleDisplayName = (role: FamilyMember['role']) => {
    switch (role) {
      case 'main_admin': return 'Main Admin';
      case 'co_admin': return 'Co-Admin';
      case 'parent': return 'Parent';
      case 'grandparent': return 'Grandparent';
      case 'guardian': return 'Guardian';
      case 'child': return 'Child';
    }
  };

  const handleResetPassword = (memberId: string) => {
    if (confirm('Send password reset email to this member?')) {
      console.log('Resetting password for member:', memberId);
      // TODO: Implement password reset
    }
  };

  const handleSuspendAccount = (memberId: string) => {
    if (confirm('Are you sure you want to suspend this account?')) {
      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, status: 'suspended' as const } : m
      ));
    }
  };

  const handleActivateAccount = (memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, status: 'active' as const } : m
    ));
  };

  const handleResendInvite = (memberId: string) => {
    console.log('Resending invite to member:', memberId);
    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, inviteSent: true } : m
    ));
  };

  const handleChangeEmail = (memberId: string) => {
    const newEmail = prompt('Enter new email address:');
    if (newEmail) {
      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, email: newEmail } : m
      ));
    }
  };

  const handleAddMember = () => {
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      phone: '',
      role: inviteData.role,
      avatar: '',
      status: inviteData.sendInvite ? 'pending' : 'inactive',
      joinedDate: new Date().toISOString().split('T')[0],
      hasLogin: inviteData.createLogin,
      canAdmin: inviteData.role === 'co_admin',
      permissions: getDefaultPermissions(inviteData.role),
      accountLocked: false,
      inviteSent: inviteData.sendInvite,
      relationship: inviteData.relationship
    };
    setMembers(prev => [...prev, member]);
    setInviteData({
      name: '',
      email: '',
      relationship: '',
      role: 'child',
      createLogin: true,
      tempPassword: '',
      sendInvite: true
    });
    setShowAddModal(false);
  };

  const getDefaultPermissions = (role: FamilyMember['role']): string[] => {
    switch (role) {
      case 'main_admin': return ['all'];
      case 'co_admin': return ['view_calendar', 'edit_budget', 'assign_chores', 'view_docs'];
      case 'parent': return ['view_calendar', 'view_chores', 'view_docs'];
      case 'grandparent': return ['view_docs', 'view_calendar'];
      case 'guardian': return ['view_calendar', 'view_chores'];
      case 'child': return ['view_chores', 'view_calendar'];
    }
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this family member? This action cannot be undone.')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Check for URL parameters to auto-open Add Member modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('open') === 'add') {
      setShowAddModal(true);
      // Clean up URL without triggering navigation
      window.history.replaceState({}, '', '/family/manage');
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Family Member Login + Admin Control</h1>
                  <p className="text-sm text-gray-400">
                    {members.length} member{members.length !== 1 ? 's' : ''} • 
                    {members.filter(m => m.status === 'active').length} active • 
                    {members.filter(m => m.hasLogin).length} with login access
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Family Member
            </button>
          </div>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">Main Household Admin Controls</span>
          </div>
          <p className="text-sm text-gray-300">
            As the Main Admin, you can create logins, reset passwords, manage roles, and control account access for all family members.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search members by name, email, or relationship..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        member.name.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                      {member.customLabel && (
                        <span className="text-sm text-purple-400">{member.customLabel}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <span>Role: {getRoleDisplayName(member.role)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Status:</span>
                        {getStatusBadge(member.status)}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-2">
                      Email: {member.email}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Last Login: {formatLastLogin(member.lastLogin)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {member.role !== 'main_admin' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLoginSettingsModal({ isOpen: true, memberId: member.id })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Login Settings
                    </button>
                    
                    <button
                      onClick={() => setRolePermissionsModal({ isOpen: true, memberId: member.id })}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Role & Permissions
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p>No family members found</p>
            {searchQuery && (
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            )}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Add Family Member</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={inviteData.name}
                    onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
                  <input
                    type="text"
                    value={inviteData.relationship}
                    onChange={(e) => setInviteData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Son, Mother, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value as FamilyMember['role'] }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="guardian">Guardian</option>
                  <option value="co_admin">Co-Admin</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="createLogin"
                    checked={inviteData.createLogin}
                    onChange={(e) => setInviteData(prev => ({ ...prev, createLogin: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="createLogin" className="text-sm text-gray-300">
                    Create login account for this member
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendInvite"
                    checked={inviteData.sendInvite}
                    onChange={(e) => setInviteData(prev => ({ ...prev, sendInvite: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sendInvite" className="text-sm text-gray-300">
                    Send welcome email invitation
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!inviteData.name || !inviteData.email || !inviteData.relationship}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Family Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Settings Modal */}
      {loginSettingsModal.isOpen && loginSettingsModal.memberId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">🔐 Login Settings</h2>
              <button
                onClick={() => setLoginSettingsModal({ isOpen: false, memberId: null })}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const member = members.find(m => m.id === loginSettingsModal.memberId);
              if (!member) return null;

              return (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">👤 Email</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={member.email}
                        readOnly
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                      <button
                        onClick={() => handleChangeEmail(member.id)}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">🔑 Reset Password</label>
                    <button
                      onClick={() => handleResetPassword(member.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Send Password Reset Email
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">🟢 Account Status</label>
                    <div className="flex items-center gap-2">
                      <span className="flex-1">{getStatusBadge(member.status)}</span>
                      <select
                        value={member.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as FamilyMember['status'];
                          if (newStatus === 'suspended') {
                            handleSuspendAccount(member.id);
                          } else if (newStatus === 'active') {
                            handleActivateAccount(member.id);
                          }
                        }}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {member.status === 'pending' && (
                    <div>
                      <button
                        onClick={() => handleResendInvite(member.id)}
                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Re-send Invitation Email
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => setLoginSettingsModal({ isOpen: false, memberId: null })}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setLoginSettingsModal({ isOpen: false, memberId: null })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Role & Permissions Modal */}
      {rolePermissionsModal.isOpen && rolePermissionsModal.memberId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">🛠 Role & Permissions</h2>
              <button
                onClick={() => setRolePermissionsModal({ isOpen: false, memberId: null })}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const member = members.find(m => m.id === rolePermissionsModal.memberId);
              if (!member) return null;

              return (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
                    <select
                      value={member.relationship}
                      onChange={(e) => {
                        setMembers(prev => prev.map(m => 
                          m.id === member.id ? { ...m, relationship: e.target.value } : m
                        ));
                      }}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Daughter">Daughter</option>
                      <option value="Son">Son</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Husband">Husband</option>
                      <option value="Wife">Wife</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Custom Label</label>
                    <input
                      type="text"
                      value={member.customLabel || ''}
                      onChange={(e) => {
                        setMembers(prev => prev.map(m => 
                          m.id === member.id ? { ...m, customLabel: e.target.value } : m
                        ));
                      }}
                      placeholder="e.g., Jamie 💗"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role Preset</label>
                    <select
                      value={member.role}
                      onChange={(e) => {
                        const newRole = e.target.value as FamilyMember['role'];
                        setMembers(prev => prev.map(m => 
                          m.id === member.id ? { 
                            ...m, 
                            role: newRole,
                            permissions: getDefaultPermissions(newRole),
                            canAdmin: newRole === 'co_admin'
                          } : m
                        ));
                      }}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="guardian">Guardian</option>
                      <option value="co_admin">Co-Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">--- Permissions Table ---</label>
                    <div className="space-y-3 bg-gray-800 rounded-lg p-4">
                      {[
                        { key: 'view_calendar', label: 'View Calendar' },
                        { key: 'view_chores', label: 'See Assigned Chores' },
                        { key: 'upload_docs', label: 'Upload Documents' },
                        { key: 'view_budget', label: 'View Budget' },
                        { key: 'edit_budget', label: 'Edit Budget' },
                        { key: 'assign_chores', label: 'Assign Chores' },
                        { key: 'view_docs', label: 'View Documents' }
                      ].map((permission) => (
                        <div key={permission.key} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`perm-${permission.key}`}
                            checked={member.permissions.includes(permission.key)}
                            onChange={(e) => {
                              setMembers(prev => prev.map(m => 
                                m.id === member.id ? {
                                  ...m,
                                  permissions: e.target.checked 
                                    ? [...m.permissions, permission.key]
                                    : m.permissions.filter(p => p !== permission.key)
                                } : m
                              ));
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`perm-${permission.key}`} className="text-sm text-gray-300">
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setMembers(prev => prev.map(m => 
                          m.id === member.id ? {
                            ...m,
                            permissions: getDefaultPermissions(member.role)
                          } : m
                        ));
                      }}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset to Default for {getRoleDisplayName(member.role)} Role
                    </button>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-sm text-yellow-400">
                      ⚠️ You (Main Admin) are the only one who can change these.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => setRolePermissionsModal({ isOpen: false, memberId: null })}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setRolePermissionsModal({ isOpen: false, memberId: null })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Role & Access
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
