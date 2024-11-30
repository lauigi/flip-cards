'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTopicModal({ isOpen, onClose }: NewTopicModalProps) {
  const router = useRouter();
  const [newTopicName, setNewTopicName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create new topic and add file
      const response = await fetch('/api/topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTopicName,
          summary: newTopicName,
          chapters: [],
        }),
      });

      if (!response.ok) throw new Error('Failed to create a new topic');
      const resData = await response.json();
      console.log('New topic created:', resData);
      router.push(`/topic/${resData.topicId}`);
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
          <h2 className="text-xl font-semibold text-[#1A1C1E]">Create New Course</h2>
          <p className="text-gray-600 text-sm mt-1">
            Please enter course&#39;s name. All your documents will grouped by the course you created and selected
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
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
          </div>
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
            disabled={isSubmitting}
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
