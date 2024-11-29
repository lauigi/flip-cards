import React from 'react';
import { CourseGrid } from './components/CourseGrid';
import { FileUploadZone } from './components/FileUploadZone';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F0F2F5]">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-5">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1A1C1E] font-serif">Flipping Cards</h1>
            <p className="text-gray-600 text-base mt-2 font-sans">Flipping, Flipping and Flipping!</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-10">
        {/* File Upload Area */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-[#1A1C1E] font-serif">Upload Your World</h2>
          <FileUploadZone />
        </div>

        {/* Course List */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-[#1A1C1E] font-serif">Collection Gallery</h2>
          <CourseGrid />
        </div>
      </div>
    </main>
  );
}
