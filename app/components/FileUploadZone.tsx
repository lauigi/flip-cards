'use client';

import { useRef, useState } from 'react';
import { UploadSuccessModal } from './UploadSuccessModal';
import { IChapter } from '../models/Chapter';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { FILE_SIZE_LIMIT, FILE_SIZE_LIMIT_WORDING } from '@/libs/config';

interface Props {
  onUploadSuccess?: (file: { id: string; filename: string; url: string }) => void;
  // ... other props
}

export function FileUploadZone({ onUploadSuccess }: Props) {
  const { data: session } = useSession();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState('');
  const [newChapterData, setNewChapterData] = useState<Pick<IChapter, 'name' | 'summary' | 'cards'>>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const { toast } = useToast();

  const handleAddChapter = () => {
    if (isUploading) return;
    if (!session?.user) {
      console.log('toast,here');
      toast({
        title: 'Not logged in',
        description: 'Please sign in to upload files',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
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

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import-ai', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedFileId(data.id);
      setNewChapterData(data);
      setShowSuccessModal(true);

      onUploadSuccess?.(data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed, please try again');
    } finally {
      setIsUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto p-6">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            cursor-pointer
            min-h-[300px] bg-white
            ${isDragging ? 'border-[#F97316]' : 'border-gray-300'}
          `}
          onClick={handleAddChapter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileSelect}
            id="fileInput"
            ref={fileInputRef}
            disabled={isUploading || !session?.user}
          />

          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Drag and drop PDF file here or</p>
            <p className="cursor-pointer text-[#F97316] hover:text-[#EA580C]">click to upload</p>
          </div>

          {isUploading && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 animate-gradient-x bg-[length:200%_100%]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <UploadSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
        }}
        fileId={uploadedFileId}
        allowNewTopic={true}
        newChapterData={newChapterData}
      />
    </>
  );
}
