'use client';

import { signIn } from 'next-auth/react';

export const LoginButton = () => {
  return (
    <button
      onClick={() => signIn('google')}
      className="px-4 py-2 text-white bg-amber-600 rounded-md hover:bg-amber-500">
      Sign in with Google to view courses
    </button>
  );
};
