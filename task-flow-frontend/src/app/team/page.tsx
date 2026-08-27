'use client';

import { Layout } from '@/components/layout/Layout';
import { useUsers } from '@/hooks/useUsers';
import { useInvitations } from '@/hooks/useInvitations';
import { useTeam } from '@/contexts/TeamContext';
import { Users, Mail, MoreVertical, UserPlus, Send, X, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TeamPage() {
  const { users, isLoading: usersLoading, error: usersError } = useUsers();
  const { invitations, sendInvitation, isSending } = useInvitations();
  const { currentTeam, teams, isLoading: teamLoading, createTeam, loadTeams } = useTeam();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Force reload teams when page loads
  useEffect(() => {
    console.log('TeamPage mounted, reloading teams...');
    const token = localStorage.getItem('token');
    if (token) {
      loadTeams();
    }
  }, [loadTeams]);

  // Debug: Log teams data
  useEffect(() => {
    console.log('Teams in TeamPage:', teams);
    console.log('Current team in TeamPage:', currentTeam);
    console.log('Number of teams:', teams.length);
  }, [teams, currentTeam]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    setIsCreating(true);
    try {
      await createTeam({ name: newTeamName, description: newTeamDescription });
      setIsCreateTeamModalOpen(false);
      setNewTeamName('');
      setNewTeamDescription('');
      toast.success('Team created successfully!');
      // Reload teams after creation
      await loadTeams();
    } catch (error) {
      console.error('Create team error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!currentTeam) {
      toast.error('Please select a team first');
      return;
    }
    sendInvitation({ 
      email: inviteEmail, 
      name: inviteName,
      role: inviteRole,
      teamId: currentTeam.id
    });
    setInviteEmail('');
    setInviteName('');
    setInviteRole('MEMBER');
    setIsInviteModalOpen(false);
  };

  if (usersLoading || teamLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (usersError) {
    return (
      <Layout>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-red-600">Error loading team members. Please try again.</p>
        </div>
      </Layout>
    );
  }

  // If no teams exist, show create team screen
  if (!teams || teams.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
          <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
            <Users className="text-blue-600" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Create Your Team</h3>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            You haven't created a team yet. Create one to start collaborating with your team members.
          </p>
          <button
            onClick={() => setIsCreateTeamModalOpen(true)}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create Team
          </button>
        </div>

        {/* Create Team Modal */}
        {isCreateTeamModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Create New Team</h2>
                <button
                  onClick={() => setIsCreateTeamModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    placeholder="What is this team for?"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateTeamModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isCreating ? 'Creating...' : 'Create Team'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
            <p className="text-gray-500">Manage team members and view workload</p>
            {currentTeam && (
              <p className="text-sm text-blue-600 mt-1">Current Team: {currentTeam.name}</p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setIsCreateTeamModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus size={18} />
              New Team
            </button>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!currentTeam}
            >
              <UserPlus size={20} />
              Invite Member
            </button>
          </div>
        </div>

        {/* Pending Invitations */}
        {invitations.filter(inv => inv.status === 'PENDING').length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800">Pending Invitations</h3>
            <div className="mt-2 space-y-2">
              {invitations
                .filter(inv => inv.status === 'PENDING')
                .map((inv) => (
                  <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
                    <span className="text-yellow-700">{inv.email}</span>
                    <span className="text-xs text-yellow-600">
                      Expires: {new Date(inv.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No team members found</h3>
            <p className="text-gray-500 mt-1">Invite your first team member to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(member => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      member.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {member.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role || 'Team Member'}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={16} />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create New Team</h2>
              <button
                onClick={() => setIsCreateTeamModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter team name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  placeholder="What is this team for?"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Invite Team Member</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., ADMIN, MANAGER, DEVELOPER"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Custom role. Examples: ADMIN, MANAGER, DEVELOPER, DESIGNER
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                  {isSending ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}