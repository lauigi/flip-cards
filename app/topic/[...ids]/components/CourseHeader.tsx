interface CourseHeaderProps {
  course: {
    name: string;
  } | null;
}

export default function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-[#1A1C1E]">{course?.name}</h1>
      <div className="mt-4 flex items-center gap-4">
        <button
          className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm
                           hover:bg-[#EA580C] transition-colors duration-200">
          Start Learning
        </button>
        <button
          className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm
                           hover:bg-gray-50 rounded-lg transition-colors duration-200">
          Edit Course
        </button>
      </div>
    </div>
  );
}
