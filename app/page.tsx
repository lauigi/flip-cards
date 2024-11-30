import React from 'react';
import { CourseGrid } from './components/CourseGrid';
import { FileUploadZone } from './components/FileUploadZone';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F0F2F5]">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-3 pt-3 pb-1">
          {/* File Upload Area */}
          <div className="mb-12 flex items-center">
            <h2 className="text-2xl font-semibold mb-4 shrink-0 text-[#1A1C1E] font-serif">Upload Your Document</h2>
            <FileUploadZone />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-10">
        {/* Course List */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-[#1A1C1E] font-serif">Collection Gallery</h2>
          <CourseGrid />
        </div>
      </div>
    </main>
  );
}
