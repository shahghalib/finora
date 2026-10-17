'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useAuthActions } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { cn } from '@/lib/utils';

// New signups default to PKR. The mockup doesn't expose a currency picker on
// this screen — surface it later in onboarding if per-user selection is needed.
const DEFAULT_CURRENCY = 'PKR';

export default function SignupPage() {
  const router = useRouter();
  const { handleSignup } = useAuthActions();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasMinLength || !hasNumber || !hasSymbol) {
      setError('Password must be at least 8 characters and include a number and a symbol.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await handleSignup({ username, email, password, defaultCurrency: DEFAULT_CURRENCY });
      router.push('/onboarding/step1');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      // Type-safe error handling
      let message = 'Signup failed. Please try again.';
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
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">Create Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your details to provision your secure workspace.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label
            htmlFor="username"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Full Name
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="John Doe"
            className="h-11"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Corporate Email
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Confirm Password
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              className="h-11"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {[
            { label: '8+ Characters', met: hasMinLength },
            { label: 'Number', met: hasNumber },
            { label: 'Symbol', met: hasSymbol },
          ].map(({ label, met }) => (
            <span
              key={label}
              className={cn(
                'flex items-center gap-1 font-medium',
                met ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {met ? <Check className="h-3 w-3" /> : <span className="text-xs">•</span>}
              {label}
            </span>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="h-12 w-full gap-2 text-base font-semibold"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
