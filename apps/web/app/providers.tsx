'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { MusicProvider, useMusic } from "@/contexts/MusicContext";
import { Toast } from '@musiversal/design-system';

const queryClient = new QueryClient();

function AppContent({ children }: { children: React.ReactNode }) {
  const { currentSong } = useMusic();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <main className={`flex-1 ${currentSong ? 'pb-32 sm:pb-20' : ''}`}>
        {children}
      </main>
      <MusicPlayer />
      <Toast />
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>
        <AppContent>
          {children}
        </AppContent>
      </MusicProvider>
    </QueryClientProvider>
  );
} 