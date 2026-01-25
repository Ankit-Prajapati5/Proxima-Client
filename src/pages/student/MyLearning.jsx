import { useGetMyLearningQuery } from "@/features/api/purchaseApi";
import Course from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";

const MyLearning = () => {
  const { data, isLoading, isError } = useGetMyLearningQuery();
  const myLearningCourses = data?.courses || [];

  return (
    <div className="bg-[#f8fafc] dark:bg-zinc-950 min-h-screen transition-colors duration-500 pt-24 lg:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest">
              Student Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter italic uppercase">
              My Learning<span className="text-blue-600">.</span>
            </h1>
          </div>
          
          <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
            Total Enrolled: <span className="text-zinc-900 dark:text-white">{myLearningCourses.length}</span>
          </div>
        </div>

        {/* CONTENT AREA */}
        {isLoading ? (
          <MyLearningSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
             <p className="text-zinc-500 font-bold italic uppercase tracking-widest">
                Please login to view your journey.
             </p>
          </div>
        ) : myLearningCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
              <GraduationCap size={32} />
            </div>
            <div className="space-y-1">
               <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">No courses found</h3>
               <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto">
                 Bhai, abhi tak kisi course mein enroll nahi kiya? Aaj hi seekhna shuru karo!
               </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {myLearningCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

/* ======================
   SKELETON (Consistent with Course Card)
====================== */
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="space-y-4 bg-white dark:bg-zinc-900/50 p-4 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);