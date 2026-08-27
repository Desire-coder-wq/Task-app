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

const TeamContext = createContext<TeamContextType>({
  currentTeam: null,
  teams: [],
  setCurrentTeam: () => {},
  loadTeams: async () => {},
  isLoading: false,
  createTeam: async () => {
    throw new Error('createTeam not implemented');
  },
});

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const loadTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading teams...');
      
      // Check if user is logged in
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
      
      // Ensure userTeams is always an array
      const teamsArray = Array.isArray(userTeams) ? userTeams : [];
      setTeams(teamsArray);
      
      if (teamsArray.length > 0) {
        // If we have a current team, check if it's still valid
        if (currentTeam) {
          const stillValid = teamsArray.find(t => t.id === currentTeam.id);
          if (stillValid) {
            // Keep current team
          } else {
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

  const createTeam = async (data: { name: string; description?: string }) => {
    try {
      const newTeam = await teamsService.createTeam(data);
      console.log('Created team:', newTeam);
      
      // Update teams list
      setTeams(prev => [...prev, newTeam]);
      setCurrentTeam(newTeam);
      
      toast.success('Team created successfully');
      return newTeam;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create team');
      throw error;
    }
  };

  // Load teams on mount
  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Listen for token changes (login/logout)
  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem('token');
      console.log('Token changed, reloading teams. Token exists:', !!token);
      loadTeams();
    };

    // Check for token changes every 2 seconds
    let lastToken = localStorage.getItem('token');
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== lastToken) {
        lastToken = currentToken;
        handleTokenChange();
      }
    }, 2000);

    // Also listen for storage events (for login in other tabs)
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

  // Listen for custom login events
  useEffect(() => {
    const handleLoginEvent = () => {
      console.log('Custom login event detected, reloading teams...');
      loadTeams();
    };

    window.addEventListener('user-login', handleLoginEvent);
    
    return () => {
      window.removeEventListener('user-login', handleLoginEvent);
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
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};