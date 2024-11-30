'use client';

import { useState, useEffect } from 'react';
import { IChapter } from '../models/Chapter';
import { useRouter } from 'next/navigation';

interface Topic {
  id: string;
  name: string;
}

interface UploadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  allowNewTopic: boolean;
  newChapterData?: Pick<IChapter, 'name' | 'summary' | 'cards'>;
}

export function UploadSuccessModal({ isOpen, onClose, allowNewTopic, newChapterData }: UploadSuccessModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [topics, setTopics] = useState<(Topic & { _id: string })[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch existing topics
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics');
        const topics = await response.json();
        setTopics(topics || []);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        setTopics([]);
      }
    };

    if (isOpen) {
      fetchTopics();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (mode === 'existing') {
        // Add to existing topic
        const response = await fetch(`/api/topic/${selectedTopicId}/chapter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newChapterData),
        });

        if (!response.ok) throw new Error('Failed to add new chapter to topic');
        router.push(`/topic/${selectedTopicId}`);
      } else {
        // Create new topic and add file
        const response = await fetch('/api/topic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newTopicName,
            summary: newTopicName,
            chapters: [newChapterData],
          }),
        });

        if (!response.ok) throw new Error('Failed to create a new topic');
        const resData = await response.json();
        console.log('New topic created:', resData);
        router.push(`/topic/${resData.topicId}`);
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Operation failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1A1C1E]">File Upload Successful</h2>
          <p className="text-gray-600 text-sm mt-1">Please choose to add to existing topic or create new topic</p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Select Existing Topic */}
          <div className="space-y-3">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={mode === 'existing'}
                onChange={() => setMode('existing')}
                className="w-4 h-4 text-[#F97316] focus:ring-[#F97316] border-gray-300"
              />
              <span className="ml-2 text-[#1A1C1E] font-medium">Add to Existing Topic</span>
            </label>

            {mode === 'existing' && (
              <select
                value={selectedTopicId}
                onChange={e => setSelectedTopicId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-700 text-sm focus:ring-2 focus:ring-[#F97316]/20 
                         focus:border-[#F97316] hover:border-[#F97316]
                         transition-colors duration-200">
                <option value="">Select Topic...</option>
                {Array.isArray(topics) &&
                  topics.map(topic => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* Create New Topic */}
          {allowNewTopic && (
            <div className="space-y-3">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={mode === 'new'}
                  onChange={() => setMode('new')}
                  className="w-4 h-4 text-[#F97316] focus:ring-[#F97316] border-gray-300"
                />
                <span className="ml-2 text-[#1A1C1E] font-medium">Create New Topic</span>
              </label>

              {mode === 'new' && (
                <input
                  type="text"
                  value={newTopicName}
                  onChange={e => setNewTopicName(e.target.value)}
                  placeholder="Enter topic name"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-700 text-sm focus:ring-2 focus:ring-[#F97316]/20
                         focus:border-[#F97316] hover:border-[#F97316]
                         transition-colors duration-200"
                />
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 hover:text-gray-900 text-sm font-medium
                     hover:bg-gray-50 rounded-lg transition-colors duration-200"
            disabled={isSubmitting}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (mode === 'existing' && !selectedTopicId) || (mode === 'new' && !newTopicName)}
            className="px-4 py-2.5 bg-[#F97316] text-white rounded-lg text-sm font-medium
                     hover:bg-[#EA580C] transition-colors duration-200 shadow-sm
                     disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
