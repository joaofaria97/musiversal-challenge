import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  songControllerFindAll,
  songControllerCreate,
  songControllerUpdate,
  songControllerDelete,
  type SongControllerCreateBody,
  type SongControllerUpdateBody
} from '@musiversal/api-client';
import { toast } from '@musiversal/design-system';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

export function useSongs(search?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: songs, isLoading, error } = useQuery({
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

  const createSong = useMutation({
    mutationFn: (data: SongControllerCreateBody) => songControllerCreate(data),
    onSuccess: () => {
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

  const updateSong = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SongControllerUpdateBody }) => 
      songControllerUpdate(id, data),
    onSuccess: () => {
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

  const deleteSong = useMutation({
    mutationFn: (id: string) => songControllerDelete(id),
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
    createSong: (data: SongControllerCreateBody) => createSong.mutate(data),
    updateSong: (id: string, data: SongControllerUpdateBody) => updateSong.mutate({ id, data }),
    deleteSong: (id: string) => deleteSong.mutate(id),
    isUploading: createSong.isPending,
    isUpdating: updateSong.isPending,
    isDeleting: deleteSong.isPending
  };
} 