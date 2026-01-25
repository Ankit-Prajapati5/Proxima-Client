import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, Sparkles } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const { id: courseId, lectureId } = useParams();

  return (
    <div className="flex-1 min-h-screen bg-white dark:bg-[#0A0A0A]">
      {/* 🚀 RESPONSIVE HEADER */}
      <div className="max-w-5xl mx-auto px-4 pt-24 md:pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-8">
          
          <div className="flex items-center gap-4">
            <Link to={`/admin/course/${courseId}/lecture`}>
              <Button 
                size="icon" 
                variant="outline" 
                className="rounded-2xl h-12 w-12 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-90 shadow-sm"
                aria-label="Back to lectures"
              >
                <ArrowLeft size={20} className="text-zinc-600 dark:text-zinc-400" />
              </Button>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl md:text-3xl uppercase italic tracking-tighter">
                  Edit <span className="text-blue-600">Lecture</span>
                </h1>
                <Sparkles className="text-blue-500 hidden md:block" size={18} />
              </div>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">
                Refine your content experience
              </p>
            </div>
          </div>

          {/* Quick Action / Status - Mobile pe hide ya adjust kar sakte ho */}
          <div className="hidden md:flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-900/20">
            <Edit3 size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400">Editor Mode Active</span>
          </div>
        </div>
      </div>

      {/* 📝 MAIN TAB CONTENT */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <LectureTab courseId={courseId} lectureId={lectureId} />
        </div>
      </div>
    </div>
  );
};

export default EditLecture;