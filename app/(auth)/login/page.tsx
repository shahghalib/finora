'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthActions } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/ui/password-input';

export default function LoginPage() {
  const router = useRouter();
  const { handleLogin } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await handleLogin(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      // Type-safe error handling
      let message = 'Invalid credentials';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = err.response as { data?: { message?: string } };
        if (response.data?.message) {
          message = response.data.message;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">Sign in to your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Secure access to your financial dashboard.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@company.com"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Password
          </Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            className="h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <Checkbox checked={rememberMe} onCheckedChange={setRememberMe} />
          Remember me
        </label>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
