'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const fetchTopicName = async (topicId: string) => {
  if (topicId) {
    try {
      const response = await fetch(`/api/topicName/${topicId}`);
      if (response.ok) {
        const topicName: string = await response.json();
        return topicName;
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
    }
  }
};

const DEFAULT_TITLE = 'Flip Cards';

const Title: FC = () => {
  const params = useParams();
  const pathname = usePathname();
  const [topicName, setTopicName] = useState('');
  const isInTopicPage = pathname.includes('/topic/');
  useEffect(() => {
    if (isInTopicPage) {
      fetchTopicName(params.id as string).then(name => {
        if (name) setTopicName(name);
        else setTopicName(DEFAULT_TITLE);
      });
    } else {
      setTopicName(DEFAULT_TITLE);
    }
  }, [isInTopicPage, params.id]);

  return (
    <Link href={params?.id ? `/topic/${params.id}` : '/'} className="text-xl font-semibold hover:text-blue-600">
      {topicName}
    </Link>
  );
};

export default Title;
