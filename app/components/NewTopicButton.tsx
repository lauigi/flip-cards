'use client';

import { useState } from 'react';
import { NewTopicModal } from './NewTopicModal';

export const NewTopicButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => {
          setIsOpen(true);
        }}>
        Create Course
      </button>
      <NewTopicModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};
