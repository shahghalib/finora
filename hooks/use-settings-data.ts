'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: api.getMe,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    // Returning the promise makes mutateAsync() wait until the fresh profile is loaded.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.uploadProfilePicture,
    // Returning the promise makes mutateAsync() wait until the fresh profile is loaded.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
}