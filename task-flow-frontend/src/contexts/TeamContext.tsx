'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { teamsService, Team } from '@/services/teams.service';
import toast from 'react-hot-toast';

interface TeamContextType {
  currentTeam: Team | null;
  teams: Team[];
  setCurrentTeam: (team: Team | null) => void;
  loadTeams: () => Promise<void>;
  isLoading: boolean;
  createTeam: (data: { name: string; description?: string }) => Promise<Team>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const loadTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading teams...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping team load');
        setTeams([]);
        setCurrentTeam(null);
        setIsLoading(false);
        hasLoadedRef.current = true;
        return;
      }

      const userTeams = await teamsService.getUserTeams();
      console.log('Loaded teams:', userTeams);
      
      const teamsArray = Array.isArray(userTeams) ? userTeams : [];
      setTeams(teamsArray);
      
      if (teamsArray.length > 0) {
        if (currentTeam) {
          const stillValid = teamsArray.find(t => t.id === currentTeam.id);
          if (!stillValid) {
            setCurrentTeam(teamsArray[0]);
          }
        } else {
          setCurrentTeam(teamsArray[0]);
        }
      } else {
        setCurrentTeam(null);
      }
      
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Failed to load teams:', error);
      setTeams([]);
      setCurrentTeam(null);
      hasLoadedRef.current = true;
    } finally {
      setIsLoading(false);
    }
  }, [currentTeam]);

  const createTeam = useCallback(async (data: { name: string; description?: string }) => {
    try {
      console.log('Creating team with data:', data);
      const newTeam = await teamsService.createTeam(data);
      console.log('Created team:', newTeam);
      
      setTeams(prev => [...prev, newTeam]);
      setCurrentTeam(newTeam);
      
      toast.success('Team created successfully');
      return newTeam;
    } catch (error: any) {
      console.error('Create team error:', error);
      toast.error(error.response?.data?.message || 'Failed to create team');
      throw error;
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Listen for token changes
  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem('token');
      console.log('Token changed, reloading teams. Token exists:', !!token);
      loadTeams();
    };

    let lastToken = localStorage.getItem('token');
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== lastToken) {
        lastToken = currentToken;
        handleTokenChange();
      }
    }, 2000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('Storage changed, reloading teams...');
        loadTeams();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadTeams]);

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
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};