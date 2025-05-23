import { useQuery, useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { 
  songControllerFindAll,
  songControllerCreate,
  songControllerUpdate,
  songControllerDelete,
  type SongControllerCreateBody,
  type SongControllerUpdateBody,
  type Song, // Assuming Song is the return type for create/update
} from '@musiversal/api-client';
import { toast } from '@musiversal/design-system';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

// Define a type for mutation options that can be passed to mutate functions
type MutationCallbacks<TData = unknown, TVariables = unknown> = Pick<
  UseMutationOptions<TData, AxiosError<ApiErrorResponse>, TVariables>,
  'onSuccess' | 'onError' | 'onSettled'
>;

export function useSongs(search?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: songs, isLoading, error } = useQuery<Song[], Error>({
    queryKey: ['songs', search],
    queryFn: async () => {
      if (search) {
        // For search, we need to manually construct the URL since the client doesn't support it yet
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/songs?search=${encodeURIComponent(search)}`);
        if (!response.ok) throw new Error('Failed to fetch songs');
        return response.json();
      } else {
        // For normal fetching, use the generated client
        return songControllerFindAll();
      }
    },
    retry: false,
  });

  // Handle query error
  if (error) {
    console.error('Failed to fetch songs:', error);
    toast.error('Failed to load songs. Please try again later.');
  }

  const createSongMutation = useMutation<void, AxiosError<ApiErrorResponse>, SongControllerCreateBody>({
    mutationFn: (data: SongControllerCreateBody) => songControllerCreate(data),
    onSuccess: (data, variables, context) => {
      toast.success('Song uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      router.refresh();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload song';
      toast.error(errorMessage);
    }
  });

  const updateSongMutation = useMutation<Song, AxiosError<ApiErrorResponse>, { id: string; data: SongControllerUpdateBody }>({
    mutationFn: ({ id, data }: { id: string; data: SongControllerUpdateBody }) => 
      songControllerUpdate(id, data),
    onSuccess: (data, variables, context) => {
      toast.success('Song updated successfully');
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      router.refresh();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update song';
      toast.error(errorMessage);
    }
  });

  const deleteSongMutation = useMutation<void, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (id: string) => songControllerDelete(id).then(() => undefined),
    onSuccess: () => {
      toast.success('Song deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      router.refresh();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete song';
      toast.error(errorMessage);
    }
  });

  return {
    songs,
    isLoading,
    error,
    createSong: (data: SongControllerCreateBody, options?: MutationCallbacks<void, SongControllerCreateBody>) => 
      createSongMutation.mutate(data, options),
    updateSong: (id: string, data: SongControllerUpdateBody, options?: MutationCallbacks<Song, { id: string; data: SongControllerUpdateBody }>) => 
      updateSongMutation.mutate({ id, data }, options),
    deleteSong: (id: string, options?: MutationCallbacks<void, string>) => 
      deleteSongMutation.mutate(id, options),
    isUploading: createSongMutation.isPending,
    isUpdating: updateSongMutation.isPending,
    isDeleting: deleteSongMutation.isPending
  };
} 