import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService, Team } from '@/services/teams.service';
import toast from 'react-hot-toast';

export function useTeams() {
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsService.getUserTeams(),
  });

  const createTeamMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      teamsService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create team');
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      teamsService.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update team');
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => teamsService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete team');
    },
  });

  return {
    teams,
    isLoading,
    error,
    createTeam: createTeamMutation.mutate,
    isCreating: createTeamMutation.isPending,
    updateTeam: updateTeamMutation.mutate,
    isUpdating: updateTeamMutation.isPending,
    deleteTeam: deleteTeamMutation.mutate,
    isDeleting: deleteTeamMutation.isPending,
  };
}