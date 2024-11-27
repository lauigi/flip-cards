'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const Title: FC = () => {
  const params = useParams();

  return (
    <Link href={params?.id ? `/topic/${params.id}` : '/'} className="text-xl font-semibold hover:text-blue-600">
      Flip Cards
    </Link>
  );
};

export default Title;
