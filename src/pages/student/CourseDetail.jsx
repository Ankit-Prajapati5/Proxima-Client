import { useParams, useNavigate } from "react-router-dom";
import { BadgeInfo, Calendar, Users, PlayCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import BuyCourseButton from "@/components/BuyCourseButton";
import Loader from "@/components/Loader";
import LectureList from "@/components/LectureList";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetPublicCourseByIdQuery } from "@/features/api/courseApi";
import { useLoadUserQuery } from "@/features/api/authApi";

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetPublicCourseByIdQuery(courseId);
  const course = data?.course;
  const { refetch: refetchProfile } = useLoadUserQuery();
  useEffect(() => {
    if (courseId) {
      refetch();
      refetchProfile();
    }
  }, [courseId, refetch, refetchProfile]);

  if (isLoading) return <Loader />;

  if (isError || !data?.course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black text-red-500">Course not found</h2>
          <Button onClick={() => navigate("/")} variant="outline">Go Back Home</Button>
        </div>
      </div>
    );
  }

  const { lectures = [], isPurchased = false, studentsEnrolled = 0 } = course;
  const formattedDate = course.updatedAt ? new Date(course.updatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

  const continueCourseHandler = () => {
    navigate(`/course/${courseId}/progress`);
  };

  return (
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 min-h-screen lg:h-screen w-full pt-20 lg:pt-24 flex flex-col overflow-x-hidden relative font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-0 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden relative z-10 no-scrollbar">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 h-full lg:overflow-y-auto px-4 md:px-10 lg:px-16 py-6 lg:py-10 no-scrollbar flex flex-col scroll-smooth">
          
          {/* 1. HERO TITLE */}
          <section className="space-y-4 animate-in fade-in slide-in-from-top duration-700 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={12} /> Expert-Led Program
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-zinc-900 dark:text-white">
              {course.courseTitle}
            </h1>
            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-3xl leading-relaxed">
              {course.subTitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-2">
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-2 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center uppercase text-[10px]">
                  {course.creator?.name?.charAt(0)}
                </div>
                <span className="text-zinc-900 dark:text-white">{course.creator?.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-2 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <Users size={14} className="text-orange-500" />
                <span className="text-zinc-900 dark:text-white">{studentsEnrolled} Enrolled</span>
              </div>
            </div>
          </section>

          {/* 2. MOBILE ONLY PURCHASE CARD (Order 2) */}
          <div className="block lg:hidden mb-8">
            <Card className="border-none bg-white dark:bg-zinc-900 rounded-[2rem] p-5 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                    <img src={course.courseThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4 text-center">
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                        {course.coursePrice ? `₹${course.coursePrice}` : "FREE"}
                    </h3>
                    {isPurchased ? (
                        <Button className="w-full py-6 rounded-xl bg-zinc-900 dark:bg-white dark:text-black font-black" onClick={continueCourseHandler}>
                            GO TO CLASSROOM
                        </Button>
                    ) : (
                        <BuyCourseButton courseId={courseId} onPaymentSuccess={() => { refetch(); refetchProfile(); }} />
                    )}
                </div>
            </Card>
          </div>

          {/* 3. DESCRIPTION */}
          <section className="bg-white/50 dark:bg-zinc-900/40 p-6 lg:p-8 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50 mb-8">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2 tracking-tighter italic uppercase">
              Description<span className="text-blue-600">.</span>
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed dark:prose-invert" 
                 dangerouslySetInnerHTML={{ __html: course.description || "No description provided." }} />
          </section>

          {/* 4. CURRICULUM */}
          <section className="space-y-4 mb-10">
            <h2 className="text-xl font-black flex items-center gap-2 tracking-tighter italic uppercase">
              Curriculum<span className="text-orange-500">.</span>
            </h2>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden shadow-sm">
              <LectureList lectures={lectures} courseId={course._id} isPurchased={isPurchased} />
            </div>
          </section>
        </div>

        {/* DESKTOP SIDEBAR (Laptop only) */}
        <div className="hidden lg:flex lg:col-span-4 h-full bg-white/30 dark:bg-zinc-900/20 border-l border-zinc-200 dark:border-zinc-800 p-8 xl:p-12 flex-col justify-start overflow-y-auto no-scrollbar pt-10">
          <Card className="border-none bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-6 border border-zinc-100 dark:border-zinc-800 sticky top-0">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg mb-8">
              <img src={course.courseThumbnail} alt={course.courseTitle} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Total Investment</p>
                <h3 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                  {course.coursePrice ? `₹${course.coursePrice}` : "FREE"}
                </h3>
              </div>
              <Separator className="bg-zinc-100 dark:bg-zinc-800" />
              <div className="space-y-3">
                {isPurchased ? (
                  <Button className="w-full py-8 rounded-2xl bg-zinc-900 hover:bg-black dark:bg-white dark:text-black text-sm font-black transition-all shadow-lg active:scale-95" onClick={continueCourseHandler}>
                    GO TO CLASSROOM
                  </Button>
                ) : (
                  <BuyCourseButton courseId={courseId} onPaymentSuccess={() => { refetch(); refetchProfile(); }} />
                )}
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Custom Scrollbar Hiding CSS */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CourseDetail;