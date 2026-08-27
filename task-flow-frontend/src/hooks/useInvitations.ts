import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationService, Invitation } from '@/services/InvitationService';
import toast from 'react-hot-toast';

export function useInvitations() {
  const queryClient = useQueryClient();

  const { data: invitations = [], isLoading, error } = useQuery({
    queryKey: ['invitations'],
    queryFn: () => invitationService.getInvitations(),
  });

  const sendInvitationMutation = useMutation({
    mutationFn: ({ email, name, role, teamId }: { email: string; name: string; role?: string; teamId?: string }) =>
      invitationService.sendInvitation(email, name, role, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast.success('Invitation sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    },
  });

  const resendInvitationMutation = useMutation({
    mutationFn: (id: string) => invitationService.resendInvitation(id),
    onSuccess: () => {
      toast.success('Invitation resent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resend invitation');
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: (id: string) => invitationService.cancelInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast.success('Invitation cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel invitation');
    },
  });

  return {
    invitations,
    isLoading,
    error,
    sendInvitation: sendInvitationMutation.mutate,
    isSending: sendInvitationMutation.isPending,
    resendInvitation: resendInvitationMutation.mutate,
    isResending: resendInvitationMutation.isPending,
    cancelInvitation: cancelInvitationMutation.mutate,
    isCancelling: cancelInvitationMutation.isPending,
  };
}