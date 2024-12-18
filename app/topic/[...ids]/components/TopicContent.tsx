'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import CardSection from './CardSection';
import { ICard } from '@/models/Chapter';
import { useParams, useRouter } from 'next/navigation';

interface TopicContentProps {
  course: {
    id: string;
    name: string;
    summary: string;
    chapters: {
      id: string;
      name: string;
      summary: string;
      cards: ICard[];
    }[];
  };
  chapterId?: string;
}

export default function TopicContent({ course, chapterId }: TopicContentProps) {
  const selectedChapterId = chapterId || course.chapters[0]?.id || null;
  const [isChanging, setIsChanging] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const params = useParams();
  const topicId = params.ids![0];

  const selectedChapter = course.chapters.find(chapter => chapter.id === selectedChapterId);

  const handleChapterSelect = (chapterId: string | null) => {
    if (!chapterId || chapterId === selectedChapterId) return;

    const currentIndex = course.chapters.findIndex(chapter => chapter.id === selectedChapterId);
    const newIndex = course.chapters.findIndex(chapter => chapter.id === chapterId);

    setDirection(newIndex > currentIndex ? 'left' : 'right');

    router.push(`/topic/${topicId}/${chapterId || ''}`);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
    setIsChanging(false);
  }, [chapterId]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-30 left-3 z-50 p-2 bg-white rounded-lg shadow-md">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      <div
        className={`
          fixed md:relative z-40
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          h-full
        `}>
        <Sidebar course={course} selectedChapterId={selectedChapterId} onChapterSelect={handleChapterSelect} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="mb-6">
            <div className="flex flex-col space-y-3">
              <p className="text-base text-gray-600 leading-relaxed max-w-3xl">{course.summary}</p>
            </div>
          </div>

          <div className="relative">
            <div
              className={`
                transition-all duration-300 ease-in-out
                ${isChanging ? (direction === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0') : 'translate-x-0 opacity-100'}
              `}>
              {selectedChapter ? (
                <CardSection
                  cards={selectedChapter.cards}
                  chapter={{
                    id: selectedChapter.id,
                    name: selectedChapter.name,
                    summary: selectedChapter.summary,
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No cards available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
