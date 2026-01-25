import React from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi"; 
import Course from './Course'; 
import { ChevronLeft } from 'lucide-react'; // Icon for back button
import { Button } from '@/components/ui/button';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Navigation ke liye hook
    const query = searchParams.get("search") || "";
    
    const { data, isLoading, isError } = useGetPublishedCourseQuery();

    const filteredCourses = data?.courses?.filter((course) => {
        const searchTerm = query.toLowerCase().trim();
        return course.courseTitle.toLowerCase().includes(searchTerm);
    });

    return (
        <div className="pt-28 min-h-screen bg-white dark:bg-zinc-950 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                
                {/* --- BACK BUTTON --- */}
                <button 
                    onClick={() => navigate("/")} 
                    className="group flex items-center gap-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all mb-8 font-bold text-xs uppercase tracking-widest"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 italic uppercase">
                    {query ? `Results for "${query}"` : "Explore All Courses"}
                </h1>

                <p className="text-zinc-500 mb-12 font-medium">
                    {filteredCourses?.length === 0 
                        ? "No Course Found" 
                        : filteredCourses?.length === 1 
                        ? "Found 1 amazing course for you." 
                        : `Found ${filteredCourses?.length} amazing courses for you.`
                    }
                </p>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-72 bg-zinc-50 dark:bg-zinc-900/50 animate-pulse rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800" />
                        ))}
                    </div>
                ) : filteredCourses?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {filteredCourses.map((course) => (
        <Course key={course._id} course={course} />
    ))}
</div>
                ) : (
                    <div className="text-center py-32 border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[3rem]">
                        <h2 className="text-2xl font-black text-zinc-300 dark:text-zinc-800 uppercase tracking-tighter mb-4">
                            No Course Found for "{query}"
                        </h2>
                        <Button 
                            onClick={() => navigate("/")}
                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] px-8 h-12"
                        >
                            Try Another Search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;