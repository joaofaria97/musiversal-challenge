'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// We don't render LoginPage directly here to avoid prop drilling or import cycle issues with layout
// The redirect will handle showing the login page.

interface AuthenticatedLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayoutWrapper({ children }: AuthenticatedLayoutWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (pathname === '/login') {
        router.replace('/'); // If authenticated and on login, redirect to home
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== '/login') {
        router.replace('/login'); // If not authenticated and not on login, redirect
      }
    }
    setIsLoading(false);
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading authentication...</p>
      </div>
    );
  }

  // If not authenticated and current path is the login page, allow login page to render
  if (!isAuthenticated && pathname === '/login') {
    return <>{children}</>; // This will render the app/login/page.tsx content
  }

  // If not authenticated and not on login page (should have been redirected, but as a fallback)
  if (!isAuthenticated) {
     // This state should ideally not be reached if redirects work, 
     // but as a safety net, we prevent rendering children.
     // The useEffect should handle the redirect to /login.
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting to login...</p>
        </div>
    ); 
  }
  
  // If authenticated, render the children
  return <>{children}</>;
} 