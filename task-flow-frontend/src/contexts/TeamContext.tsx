'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { teamsService, Team } from '@/services/teams.service';
import toast from 'react-hot-toast';

interface TeamContextType {
  currentTeam: Team | null;
  teams: Team[];
  setCurrentTeam: (team: Team | null) => void;
  loadTeams: () => Promise<void>;
  isLoading: boolean;
  createTeam: (data: { name: string; description?: string }) => Promise<void>;
}

const TeamContext = createContext<TeamContextType>({
  currentTeam: null,
  teams: [],
  setCurrentTeam: () => {},
  loadTeams: async () => {},
  isLoading: false,
  createTeam: async () => {},
});

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadTeams = async () => {
    try {
      setIsLoading(true);
      const userTeams = await teamsService.getUserTeams();
      setTeams(userTeams);
      
      // If no current team and user has teams, select first one
      if (!currentTeam && userTeams.length > 0) {
        setCurrentTeam(userTeams[0]);
      }
    } catch (error) {
      console.error('Failed to load teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (data: { name: string; description?: string }) => {
    try {
      const newTeam = await teamsService.createTeam(data);
      await loadTeams();
      setCurrentTeam(newTeam);
      toast.success('Team created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create team');
      throw error;
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <TeamContext.Provider value={{
      currentTeam,
      teams,
      setCurrentTeam,
      loadTeams,
      isLoading,
      createTeam,
    }}>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};