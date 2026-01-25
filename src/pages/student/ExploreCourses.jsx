import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, BookOpen, GraduationCap, LayoutGrid, ArrowRight } from 'lucide-react';
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import Course from "./Course";
import { Skeleton } from "@/components/ui/skeleton";

const ExploreCourses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Dynamic Categories: Data se unique categories nikalna
  const categories = useMemo(() => {
    if (!data?.courses) return ["All"];
    const uniqueCats = [...new Set(data.courses.map(c => c.category?.toUpperCase()).filter(Boolean))];
    return ["All", ...uniqueCats];
  }, [data]);

  // 2. Filtering Logic: Search aur Category dono apply karna
  const filteredCourses = data?.courses?.filter(course => {
    const matchesSearch = course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] dark:bg-zinc-950">
        <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-red-100 dark:border-red-900/20">
          <p className="text-red-500 font-bold mb-4">Courses load karne mein problem hui!</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-widest">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 min-h-screen pt-24 pb-20 transition-colors duration-500 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER: Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
              Explore <span className="text-blue-600">Courses</span>
            </h1>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <GraduationCap size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {filteredCourses?.length || 0} Programs Found
              </span>
            </div>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-4 pl-12 pr-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xl shadow-blue-900/5 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SIDEBAR: Category Filter */}
          <aside className="lg:col-span-3">
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white dark:border-zinc-800 p-6 rounded-[2.5rem] sticky top-28 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <SlidersHorizontal size={18} className="text-blue-600" />
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Filter By</h3>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-3 ml-1">Categories</p>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-between group ${
                      selectedCategory === cat 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1" 
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && <ArrowRight size={14} className="animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT: Courses Grid */}
          <main className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)}
              </div>
            ) : filteredCourses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {filteredCourses.map((course) => (
                  <Course key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white/30 dark:bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="w-20 h-20 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                  <BookOpen size={32} className="text-zinc-400" />
                </div>
                <h2 className="text-xl font-black tracking-tight">No results for "{searchQuery}"</h2>
                <p className="text-xs font-medium text-zinc-500 mt-2">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory("All")}}
                  className="mt-8 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

/* ======================
    SKELETON COMPONENT
====================== */
const CourseSkeleton = () => (
  <div className="bg-white/50 dark:bg-zinc-900/50 border border-white dark:border-zinc-800 rounded-[2.5rem] p-4 space-y-4">
    <Skeleton className="w-full h-48 rounded-[2rem]" />
    <div className="space-y-3 px-2">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

export default ExploreCourses;