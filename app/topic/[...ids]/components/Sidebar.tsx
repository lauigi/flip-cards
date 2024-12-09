'use client';

import { useRef, useState } from 'react';
import ChapterList from './ChapterList';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { FILE_SIZE_LIMIT, FILE_SIZE_LIMIT_WORDING } from '@/lib/config';

interface Course {
  id: string;
  name: string;
  chapters: {
    id: string;
    name: string;
    summary: string;
    cards: {
      id: string;
      question: string;
      answer: string;
    }[];
  }[];
}

interface SidebarProps {
  course: Course;
  selectedChapterId: string | null;
  onChapterSelect: (chapterId: string | null) => void;
}

const EXP_API_MAP = {
  '0': '/api/import',
  '1': '/api/import-no-bg',
  '2': '/api/import-no-fb',
  '3': '/api/import-control',
};

export default function Sidebar({ course, selectedChapterId, onChapterSelect }: SidebarProps) {
  const { id: selectedTopicId } = useParams();
  const searchParams = useSearchParams();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddChapter = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    // Check file size
    if (file.size > FILE_SIZE_LIMIT) {
      toast({
        title: 'File too large',
        description: `Please upload a file smaller than ${FILE_SIZE_LIMIT_WORDING}`,
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('topicId', selectedTopicId as string);
    const expType = searchParams.get('exp') || '0';
    try {
      const response = await fetch(EXP_API_MAP[expType as keyof typeof EXP_API_MAP], {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.text();
      console.log('Uploaded content:', data, typeof data);
      // Add to existing topic
      const updateResponse = await fetch(`/api/topic/${selectedTopicId}/chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
      setIsUploading(false);

      if (!updateResponse.ok) {
        throw new Error('Failed to add new chapter to topic');
      }

      toast({
        title: 'Success!',
        description: 'New chapter has been added to your topic.',
        variant: 'default',
        className: 'bg-[#F97316] text-white',
        duration: 1000,
      });
      const result = await updateResponse.json();
      console.log('New chapter added:', result);
      router.push(`/topic/${selectedTopicId}/${result.chapterId}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
        duration: 1000,
      });
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsUploading(false);
  };

  const handleRenameChapter = async (chapterId: string, newName: string) => {
    try {
      const response = await fetch(`/api/chapter/${chapterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error('Failed to rename chapter');

      // 重新加载页面以获取最新数据
      location.reload();

      toast({
        title: 'Success!',
        description: 'Chapter name has been updated.',
        variant: 'default',
        className: 'bg-[#F97316] text-white',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error renaming chapter:', error);
      toast({
        title: 'Error',
        description: 'Failed to rename chapter. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      const response = await fetch(`/api/chapter/${chapterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete chapter');

      // 重新加载页面以获取最新数据
      location.reload();

      toast({
        title: 'Success!',
        description: 'Chapter has been deleted.',
        variant: 'default',
        className: 'bg-[#F97316] text-white',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chapter. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <aside
      className="sidebar-container h-full bg-white border-r-2 border-gray-200/80 
      overflow-y-auto shadow-[inset_-1px_0_0_rgba(0,0,0,0.05)] flex flex-col relative w-80">
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100">
        <div className="mb-8 text-center mt-4">
          <p className="text-sm text-gray-600">
            {course.chapters.length} {course.chapters.length === 1 ? 'Chapter' : 'Chapters'}
          </p>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />

        <button
          onClick={handleAddChapter}
          disabled={isUploading}
          className={`w-full mb-4 px-4 py-2 text-sm border rounded-lg
            ${isUploading ? 'text-gray-400 border-gray-400 cursor-not-allowed bg-gradient-to-r from-gray-100 to-gray-50 animate-pulse' : 'text-[#F97316] border-[#F97316] hover:bg-[#F97316]/5 transition-colors duration-200'}`}>
          {isUploading ? 'Adding Chapter...' : '+ Add Chapter'}
        </button>
      </div>

      {/* Chapter content */}
      <div className="flex-1 p-6">
        <ChapterList
          chapters={course.chapters}
          selectedChapterId={selectedChapterId}
          onChapterSelect={onChapterSelect}
          onRename={handleRenameChapter}
          onDelete={handleDeleteChapter}
        />
      </div>
    </aside>
  );
}
