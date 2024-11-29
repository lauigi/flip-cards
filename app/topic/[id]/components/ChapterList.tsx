'use client';

import { useState } from 'react';

interface Chapter {
  id: string;
  name: string;
  summary: string;
  cards: {
    id: string;
    question: string;
    answer: string;
  }[];
}

interface ChapterListProps {
  chapters: Chapter[];
  selectedChapterId: string | null;
  onChapterSelect: (chapterId: string | null) => void;
  onRename: (chapterId: string, newName: string) => Promise<void>;
  onDelete: (chapterId: string) => Promise<void>;
}

export default function ChapterList({
  chapters,
  selectedChapterId,
  onChapterSelect,
  onRename,
  onDelete,
}: ChapterListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleRenameClick = (chapter: Chapter) => {
    setEditingId(chapter.id);
    setEditingName(chapter.name);
  };

  const handleRenameSubmit = async (chapterId: string) => {
    try {
      await onRename(chapterId, editingName);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to rename chapter:', error);
    }
  };

  const handleDeleteClick = async (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      try {
        await onDelete(chapterId);
      } catch (error) {
        console.error('Failed to delete chapter:', error);
      }
    }
  };

  return (
    <nav className="space-y-2">
      {chapters.map(chapter => (
        <div key={chapter.id} className="group relative">
          {editingId === chapter.id ? (
            <div className="p-4 rounded-lg bg-white border border-amber-200">
              <input
                type="text"
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                className="w-full px-2 py-1 border rounded"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleRenameSubmit(chapter.id)}
                  className="px-3 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600">
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => onChapterSelect(chapter.id)}
              className={`block p-4 rounded-lg transition-colors duration-200 cursor-pointer
                ${selectedChapterId === chapter.id ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#1A1C1E]">{chapter.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {chapter.cards.length} {chapter.cards.length === 1 ? 'card' : 'cards'}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={e => {
                      e.preventDefault();
                      handleRenameClick(chapter);
                    }}
                    className="p-1 text-gray-500 hover:text-amber-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={e => {
                      e.preventDefault();
                      handleDeleteClick(chapter.id);
                    }}
                    className="p-1 text-gray-500 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
