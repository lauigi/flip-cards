import React from 'react';
import { CourseGrid } from './components/CourseGrid';
import { NewTopicButton } from './components/NewTopicButton';
import { auth } from './lib/auth';

export default async function Home() {
  const session = await auth();
  return (
    <main className="min-h-screen bg-[#F0F2F5]">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-3 py-3 flex items-center justify-between ">
        <h2 className="flex-grow-0 text-2xl font-semibold text-[#1A1C1E]">Course Gallery</h2>
        {session && <NewTopicButton />}
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-10">
        {/* Course List */}
        <div className="text-center">
          <CourseGrid />
        </div>
      </div>
    </main>
  );
}
