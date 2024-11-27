'use client';

import { FC } from 'react';
import Logo from './Logo';
import Title from './Title';
import UserButton from './UserButton';

const TitleBar: FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b z-50">
      <div className="flex items-center gap-4">
        <Logo />
        <Title />
      </div>
      <UserButton />
    </header>
  );
};

export default TitleBar;
