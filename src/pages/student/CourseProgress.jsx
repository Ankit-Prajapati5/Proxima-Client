import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  useGetCourseProgressQuery, 
  useResetCourseProgressMutation 
} from "@/features/api/progressApi";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { 
  CheckCircle, 
  PlayCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  BadgeCheck,
  BrainCircuit
} from "lucide-react";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [resetProgress, { isLoading: isResetting }] = useResetCourseProgressMutation();

  if (isLoading) return <Loader />;
  if (isError || !data) return <div className="text-center pt-20">Failed to load progress.</div>;

  const { course, progress } = data;
  const lectures = course?.lectures || [];
  const completedLectures = progress?.completedLectures || [];

  const totalLectures = lectures.length;
  const completedCount = completedLectures.length;
  const percent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  const currentIndex = lectures.findIndex(
    (l) => l._id === progress?.lastWatchedLecture
  );
  
  const nextLecture = currentIndex !== -1 && currentIndex < totalLectures - 1 
    ? lectures[currentIndex + 1] 
    : (completedCount === 0 ? lectures[0] : null);

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      try {
        await resetProgress(courseId).unwrap();
        toast.success("Progress cleared! You can start fresh.");
        refetch(); 
      } catch (err) {
        toast.error("Failed to reset progress");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24 min-h-screen">
      
      {/* ⬅️ BACK BUTTON */}
      <button 
        onClick={() => navigate(`/course-detail/${courseId}`)}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-6 transition-all group"
      >
        <div className="p-2 rounded-full group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} />
        </div>
        <span className="font-medium text-sm">Back to Course Details</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{course?.courseTitle}</h1>
          <p className="text-gray-500">Track your learning journey and resume where you left off.</p>
        </div>
        
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
        >
          <RotateCcw size={16} className={isResetting ? "animate-spin" : ""} />
          {isResetting ? "Resetting..." : "Reset Progress"}
        </button>
      </div>

      {/* Progress Bar UI */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm mb-8">
        <div className="flex justify-between items-end mb-3">
          <span className="text-lg font-bold">Course Progress</span>
          <span className="text-green-600 font-extrabold">{percent}% Completed</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(34,197,94,0.4)]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-4 italic">
          {completedCount} of {totalLectures} lectures finished
        </p>

        {nextLecture && (
          <button
            onClick={() => navigate(`/course/${courseId}/lecture/${nextLecture._id}`)}
            className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <PlayCircle size={20} />
            {completedCount === 0 ? "Start Learning" : "Continue: " + nextLecture.lectureTitle}
            <ArrowRight size={18} className="ml-2" />
          </button>
        )}
      </div>

      {/* Lecture List Checklist */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            Course Content 
            <span className="text-sm font-normal text-zinc-400">({totalLectures} Lessons)</span>
        </h3>

        {lectures.map((lecture, index) => {

          const isCompleted = completedLectures.some((c) => 
            (typeof c === "string" ? c : c._id) === lecture._id
          );

          return (
            <div 
              key={lecture._id}
              onClick={() => navigate(`/course/${courseId}/lecture/${lecture._id}`)}
              className={`group flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                isCompleted 
                ? 'bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-800' 
                : 'border-zinc-100 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-4 w-full justify-between">

                <div className="flex items-center gap-4">
                  <span className="text-zinc-400 font-mono text-sm">
                    {String(index + 1).padStart(2, '0')}.
                  </span>

                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h4 className={`font-semibold transition-colors ${
                      isCompleted 
                      ? 'text-zinc-400 line-through' 
                      : 'group-hover:text-blue-600'
                    }`}>
                      {lecture.lectureTitle}
                    </h4>

                    {isCompleted && (
                      <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">
                        <BadgeCheck size={12} />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* 🔥 Quiz Button + Status */}
                <div className="flex items-center gap-3">
                  
                 <button
  onClick={(e) => {
    e.stopPropagation();

    if (!isCompleted) {
      toast.error("Quiz attempt karne ke liye lecture complete karo");
      return;
    }

    navigate(`/course/${courseId}/lecture/${lecture._id}/quiz`);
  }}
  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
    isCompleted
      ? "bg-purple-600 hover:bg-purple-500 text-white"
      : "bg-zinc-800 text-zinc-500 border border-zinc-700"
  }`}
>
  <BrainCircuit size={14} />
  {isCompleted ? "Take Quiz" : "Unlock Quiz"}
</button>


                  {isCompleted ? (
                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full transition-all group-hover:scale-110">
                      <CheckCircle
                        className="text-green-500"
                        size={18}
                        fill="currentColor"
                        fillOpacity={0.2}
                      />
                    </div>
                  ) : (
                    <PlayCircle
                      className="text-zinc-300 group-hover:text-blue-500 transition-all group-hover:scale-110"
                      size={20}
                    />
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseProgress;
