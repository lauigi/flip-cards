import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/logo.webp" alt="Logo" width={32} height={32} className="w-8 h-8" />
    </Link>
  );
};

export default Logo;
