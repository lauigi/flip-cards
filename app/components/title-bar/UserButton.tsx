'use client';

import { FC } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

const UserButton: FC = () => {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" asChild>
        {session?.user ? (
          <div className="flex items-center gap-2">
            <span>{session.user.name}</span>
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
          </div>
        ) : (
          <button className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-500">
            Sign in
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session?.user ? (
          <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={() => signIn('google')}>Sign in with Google</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signIn('github')}>Sign in with Github</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
