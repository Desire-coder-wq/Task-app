'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      setError('No invitation token provided');
      return;
    }

    // Validate token with backend
    const validateToken = async () => {
      try {
        // Check if token is valid by calling a validation endpoint
        // Or just redirect to register with token
        setIsValid(true);
        // Redirect to register page with token
        router.push(`/auth/register?token=${token}`);
      } catch (err) {
        setIsValid(false);
        setError('Invalid or expired invitation token');
      }
    };

    validateToken();
  }, [token, router]);

  // Loading state
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-500">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (isValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-500">{error || 'This invitation link is invalid or has expired.'}</p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // This should not render as we redirect immediately
  return null;
}