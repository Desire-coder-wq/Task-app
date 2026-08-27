import api from '@/lib/axios';

export interface Team {
  id: string;
  name: string;
  description?: string;
  slug: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  tasks: any[];
  invitations: any[];
  _count: {
    members: number;
    tasks: number;
  };
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export class TeamsService {
  async createTeam(data: { name: string; description?: string }): Promise<Team> {
    const response = await api.post('/teams', data);
    return response.data.data;
  }

  async getUserTeams(): Promise<Team[]> {
    const response = await api.get('/teams');
    return response.data.data;
  }

  async getTeam(id: string): Promise<Team> {
    const response = await api.get(`/teams/${id}`);
    return response.data.data;
  }

  async getTeamMembers(id: string): Promise<TeamMember[]> {
    const response = await api.get(`/teams/${id}/members`);
    return response.data.data;
  }

  async updateTeam(id: string, data: { name?: string; description?: string }): Promise<Team> {
    const response = await api.patch(`/teams/${id}`, data);
    return response.data.data;
  }

  async deleteTeam(id: string): Promise<void> {
    await api.delete(`/teams/${id}`);
  }

  async getUserRole(id: string): Promise<string> {
    const response = await api.get(`/teams/${id}/role`);
    return response.data.data;
  }
}

export const teamsService = new TeamsService();