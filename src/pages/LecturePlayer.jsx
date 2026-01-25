import { useParams, useNavigate } from "react-router-dom";
import {
  useLazyStreamLectureQuery,
  useGetCourseDetailWithLessonsQuery
} from "@/features/api/courseApi";
import {
  useMarkLectureCompletedMutation,
  useGetCourseProgressQuery
} from "@/features/api/progressApi";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  ArrowLeft, 
  Play, 
  CheckCircle2 
} from "lucide-react";
import confetti from "canvas-confetti";
import BuyCourseButton from "@/components/BuyCourseButton";

const LecturePlayer = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const [videoBlob, setVideoBlob] = useState(null);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [count, setCount] = useState(5);

  const nextTimerRef = useRef(null);
  const intervalRef = useRef(null);

  // RTK Query Hooks
  const [streamLecture, { isLoading: isStreamLoading, isError }] = useLazyStreamLectureQuery();
  const { data: courseData, isLoading: isCourseLoading } = useGetCourseDetailWithLessonsQuery(courseId);
  const { data: progressData, refetch: refetchProgress } = useGetCourseProgressQuery(courseId);
  const [markCompleted] = useMarkLectureCompletedMutation();

  const lectures = useMemo(() => courseData?.course?.lectures || [], [courseData]);
  const currentLecture = useMemo(() => lectures.find(l => l._id === lectureId), [lectures, lectureId]);
  const currentIndex = useMemo(() => lectures.findIndex(l => l._id === lectureId), [lectures, lectureId]);
  
  const nextLecture = lectures[currentIndex + 1];
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;

  // 🔥 Fix 1: Error handling logic
  const isLocked = !currentLecture?.isPreviewFree && isError;

  useEffect(() => {
    const loadVideo = async () => {
      if (lectureId && courseId) {
        setVideoBlob(null);
        try {
          // 🔥 Fix 2: Object pass karein (jaise courseApi mang raha hai)
          const result = await streamLecture({ courseId, lectureId }).unwrap();
          
          if (result?.signedUrl) {
            const response = await fetch(result.signedUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setVideoBlob(url);
          }
        } catch (err) {
          console.error("Stream Error:", err);
        }
      }
    };
    loadVideo();
    setShowNextOverlay(false);
    setCount(5);
    clearTimers();

    return () => {
      if (videoBlob) URL.revokeObjectURL(videoBlob);
    };
  }, [lectureId, courseId, streamLecture]); // Dependencies updated

  const clearTimers = () => {
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleNext = (id) => {
    clearTimers();
    navigate(`/course/${courseId}/lecture/${id}`);
  };

  const onVideoEnd = async () => {
    try {
      await markCompleted({ courseId, lectureId }).unwrap();
      toast.success("Lecture Completed.");
      refetchProgress();

      if (nextLecture) {
        setShowNextOverlay(true);
        intervalRef.current = setInterval(() => setCount(p => (p > 1 ? p - 1 : 1)), 1000);
        nextTimerRef.current = setTimeout(() => handleNext(nextLecture._id), 5000);
      } else {
        toast.success("Congratulations! Course Completed.");
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (isCourseLoading || isStreamLoading) return <Loader />;

  return (
<div className="h-screen pt-16 md:pt-20 px-2 md:px-8 max-w-7xl mx-auto flex flex-col bg-black text-white overflow-hidden">
      
      {/* Header Navigation */}
     {/* ✅ Dashboard button ka onClick update karein */}
<button
  onClick={() => {
    if (progressData) {
      navigate(`/course/${courseId}/progress`);
    } else {
      navigate(`/course-detail/${courseId}`);
    }
  }}
  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800 w-fit" // w-fit add kiya
>
  <ArrowLeft size={16} /> 
  <span className="text-xs font-medium">
    {progressData ? "Dashboard" : "Details"}
  </span>
</button>
      {/* Main Player Area */}
    <div className="relative w-full aspect-video md:max-h-[60vh] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
        
        {/* Watermark */}
        {!isLocked && user && (
          <div className="absolute top-10 left-10 z-50 pointer-events-none opacity-20 select-none">
            <p className="text-xs font-mono tracking-widest">{user.email} • SECURE SOURCE</p>
          </div>
        )}

        {isLocked ? (
          <div className="absolute inset-0 z-40 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 border border-orange-500/20">
              <Lock size={40} className="text-orange-500" />
            </div>
            <h2 className="text-3xl font-black mb-2">Premium Content</h2>
            <p className="text-zinc-400 max-w-md mb-8">This lecture is part of a premium course. Enroll now to unlock high-quality lessons and certificates.</p>
            <BuyCourseButton courseId={courseId} />
          </div>
        ) : (
          <>
            {/* Native Video Player with Blob URL */}
            <video
              ref={videoRef}
              src={videoBlob}
              className="w-full h-full object-contain"
              controls
              autoPlay
              onEnded={onVideoEnd}
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Next Lecture Overlay */}
            {showNextOverlay && nextLecture && (
              <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="text-center p-6">
                  <p className="text-orange-500 font-bold tracking-[0.2em] mb-4 text-xs uppercase">Up Next in {count}s</p>
                  <h2 className="text-2xl md:text-4xl font-bold mb-8 max-w-2xl leading-tight">{nextLecture.lectureTitle}</h2>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleNext(nextLecture._id)}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all scale-105 active:scale-95 shadow-lg shadow-orange-600/20"
                    >
                      <Play size={18} fill="currentColor" /> Play Now
                    </button>
                    <button
                      onClick={() => { clearTimers(); setShowNextOverlay(false); }}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold transition-all"
                    >
                      Stay Here
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Control Bar & Details */}
     <div className="mt-4 mb-4 bg-zinc-900/30 p-3 md:p-4 rounded-2xl border border-zinc-800/50 flex flex-row justify-between items-center gap-4">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
            {currentLecture?.lectureTitle || "Loading Lesson..."}
          </h1>
          <p className="text-orange-500 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            {courseData?.course?.courseTitle}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={!prevLecture}
            onClick={() => navigate(`/course/${courseId}/lecture/${prevLecture._id}`)}
            className={`p-4 rounded-2xl border transition-all ${
              prevLecture 
              ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white" 
              : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            disabled={!nextLecture}
            onClick={() => handleNext(nextLecture._id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
              nextLecture 
              ? "bg-white text-black hover:bg-orange-500 hover:text-white shadow-xl" 
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {nextLecture ? "Next Lesson" : "Course Finished"}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LecturePlayer;