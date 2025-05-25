'use client';

import { useState, FormEvent, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, FormLabel } from '@musiversal/design-system';
import Logo from '@/components/layout/Logo';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('An unexpected error occurred. Please check the console.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 selection:bg-violet-500 selection:text-white">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-6">
          <Logo size="xlarge" /> 
          <p className="text-slate-500">
            Please enter the password to access the collection.
          </p>
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="p-6 bg-slate-50/50 shadow-lg rounded-xl space-y-6 border border-slate-200"
        >
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
            required
            className="bg-white text-slate-900 placeholder-slate-400 focus:ring-violet-500 focus:border-violet-500"
            aria-label="Password"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-200 text-center">
              {error}
            </p>
          )}

          <Button 
            type="submit"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              const form = e.currentTarget.closest('form');
              if (form && !form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
                return;
              }
            }}
            className="w-full !bg-violet-600 hover:!bg-violet-700 focus:!ring-violet-500 text-white font-semibold py-2.5 rounded-lg transition-colors duration-150 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : 'Unlock Collection'}
          </Button>
        </form>
        <p className="text-center text-xs text-slate-400">
          For authorized access only.
        </p>
      </div>
    </div>
  );
} 