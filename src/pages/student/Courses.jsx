import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { Sparkles, LayoutGrid, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[2rem] border border-red-100 dark:border-red-900/20 text-center">
          <p className="text-red-600 dark:text-red-400 font-bold">Opps! Courses load nahi ho paye.</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-xs font-black uppercase tracking-widest bg-red-600 text-white px-6 py-2 rounded-full">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 transition-colors duration-500 min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={12} /> Newly Published
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-center">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-white dark:to-zinc-500">Latest Courses</span>
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium text-center max-w-md">
            Sabbse naye aur trending courses jo aapki skills ko next level par le jayenge.
          </p>
        </div>

        {/* Courses Grid - Restricted to 4 items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : data?.courses?.length > 0 ? (
            // Slice(0, 4) ensures only the first 4 (newest) are shown
            data.courses.slice(0, 4).map((course) => (
              <div key={course._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Course course={course} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center py-20 opacity-50">
              <LayoutGrid size={48} className="mb-4" />
              <p className="text-lg font-bold">Abhi koi naya course nahi hai.</p>
            </div>
          )}
        </div>

        {/* Explore All CTA Section */}
        {!isLoading && data?.courses?.length > 0 && (
          <div className="mt-20 flex flex-col items-center space-y-6">
            <div className="h-[1px] w-full max-w-xs bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800 to-transparent" />
            
            <Link to="/explore-courses">
              <Button className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-8 py-8 rounded-[2rem] shadow-xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
                <span className="relative z-10 flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
                  Explore All {data.courses.length} Courses 
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300 text-blue-600" />
                </span>
                
                {/* Subtle background hover effect */}
                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </Link>
            
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Join 10,000+ students today
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

/* ======================
    ENHANCED SKELETON
====================== */
const CourseSkeleton = () => {
  return (
    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-white dark:border-zinc-800 rounded-[2rem] overflow-hidden p-3 space-y-4">
      <Skeleton className="w-full h-44 rounded-[1.5rem]" />
      <div className="px-3 pb-4 space-y-4">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="pt-2">
           <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};