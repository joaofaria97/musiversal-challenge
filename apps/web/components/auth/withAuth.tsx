'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoginPage from '@/app/login/page'; // Adjusted path

// This is a simple client-side check. For more robust security, 
// you'd involve server-side checks with tokens/sessions.
const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Check localStorage for the authentication flag
      const authStatus = localStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // if not on login page and not authenticated, redirect to login
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
      setIsLoading(false);
    }, [router, pathname]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p> {/* Replace with a proper loader/spinner if you have one */}
        </div>
      );
    }

    if (!isAuthenticated && pathname !== '/login') {
      // This case handles if the redirect hasn't happened yet or if state is somehow bypassed.
      // For client-side only auth, this might be redundant if useEffect handles redirect correctly.
      // However, it can prevent a flash of unauthenticated content.
      return <LoginPage />; // Or a redirect can be triggered here too for consistency.
    }
    
    // If on the login page and already authenticated, redirect to home
    if (isAuthenticated && pathname === '/login') {
      router.replace('/');
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Redirecting...</p>
        </div>
      ); // Show a loading/redirecting state
    }

    // If authenticated or on the login page (and not yet authenticated, allowing login form to show),
    // render the wrapped component.
    return <WrappedComponent {...props} />;
  };

  // Set a display name for easier debugging
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth; 