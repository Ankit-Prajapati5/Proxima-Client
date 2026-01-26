import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCourseDetailWithLessonsQuery
} from "@/features/api/courseApi";
import {
  useMarkLectureCompletedMutation,
  useGetCourseProgressQuery
} from "@/features/api/progressApi";
import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import {
  ChevronRight,
  ChevronLeft,
  Lock,
  ArrowLeft,
  Play
} from "lucide-react";
import confetti from "canvas-confetti";
import BuyCourseButton from "@/components/BuyCourseButton";
import { userLoggedOut } from "@/features/authSlice";


const LecturePlayer = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [iframeSrc, setIframeSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const { data: courseData, isLoading } =
    useGetCourseDetailWithLessonsQuery(courseId);

  const { refetch: refetchProgress } =
    useGetCourseProgressQuery(courseId);

  const [markCompleted] = useMarkLectureCompletedMutation();

  const lectures = useMemo(
    () => courseData?.course?.lectures || [],
    [courseData]
  );

  const currentLecture = useMemo(
    () => lectures.find((l) => l._id === lectureId),
    [lectures, lectureId]
  );

  const currentIndex = useMemo(
    () => lectures.findIndex((l) => l._id === lectureId),
    [lectures, lectureId]
  );

  const nextLecture = lectures[currentIndex + 1];
  const prevLecture =
    currentIndex > 0 ? lectures[currentIndex - 1] : null;

  const isLocked =
    !currentLecture?.isPreviewFree &&
    !courseData?.course?.isPurchased;

  // ==============================
  // 🔥 ADVANCED DEVTOOLS SECURITY
  // ==============================
  useEffect(() => {
    let devtoolsDetected = false;

    const detectDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > 160 || heightDiff > 160) {
        triggerSecurity();
      }
    };

    const debuggerTrap = () => {
      const start = new Date();
      debugger;
      const end = new Date();
      if (end - start > 100) {
        triggerSecurity();
      }
    };

    const visibilityCheck = () => {
      if (document.visibilityState === "hidden") {
        console.clear();
      }
    };

    const keyBlock = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        triggerSecurity();
      }
    };

    const triggerSecurity = () => {
      if (devtoolsDetected) return;
      devtoolsDetected = true;

      setDevToolsOpen(true);
      setIframeSrc("");
      setIsPlaying(false);

      localStorage.clear();
      sessionStorage.clear();

      dispatch(userLoggedOut());

      toast.error("Security violation detected");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    };

    const interval1 = setInterval(detectDevTools, 1000);
    const interval2 = setInterval(debuggerTrap, 3000);

    window.addEventListener("resize", detectDevTools);
    document.addEventListener("keydown", keyBlock);
    document.addEventListener("visibilitychange", visibilityCheck);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      window.removeEventListener("resize", detectDevTools);
      document.removeEventListener("keydown", keyBlock);
      document.removeEventListener("visibilitychange", visibilityCheck);
    };
  }, [dispatch, navigate]);

  // ==============================
  // 🔥 RELOAD GUARD
  // ==============================
  useEffect(() => {
    const reloadKey = `lecture_reload_${courseId}_${lectureId}`;
    const reloadCount = sessionStorage.getItem(reloadKey);

    if (reloadCount === "1") {
      sessionStorage.removeItem(reloadKey);
      navigate(`/course/${courseId}/progress`, { replace: true });
    } else {
      sessionStorage.setItem(reloadKey, "1");
    }

    return () => {
      sessionStorage.removeItem(reloadKey);
    };
  }, [courseId, lectureId, navigate]);

  // Initial embed
  useEffect(() => {
    if (!currentLecture?.videoId) return;

    setIsPlaying(false);

    setIframeSrc(
      `https://www.youtube.com/embed/${currentLecture.videoId}?controls=0&rel=0&modestbranding=1&disablekb=1&playsinline=1`
    );
  }, [currentLecture?.videoId]);

  const handlePlay = () => {
    setIframeSrc(
      `https://www.youtube.com/embed/${currentLecture.videoId}?autoplay=1&controls=0&rel=0&modestbranding=1&disablekb=1&playsinline=1`
    );
    setIsPlaying(true);
  };

  const handleManualComplete = async () => {
    try {
      await markCompleted({ courseId, lectureId }).unwrap();
      toast.success("Lecture Completed");
      refetchProgress();

      if (!nextLecture) {
        confetti({
          particleCount: 200,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        navigate(`/course/${courseId}/lecture/${nextLecture._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !currentLecture) return <Loader />;

  return (
    <div className="h-[100vh] w-full flex flex-col bg-black text-white overflow-hidden">

      {devToolsOpen && (
        <div className="absolute inset-0 bg-black z-50 flex items-center justify-center text-red-500 text-xl font-bold">
          Session Terminated
        </div>
      )}

      <div className="px-4 pt-4 shrink-0">
        <button
          onClick={() => navigate(`/course-detail/${courseId}`)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800 text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="relative flex-1 mx-4 my-3 bg-black rounded-xl overflow-hidden border border-zinc-800">
        {!isLocked && user && (
          <div className="absolute top-4 left-4 z-40 pointer-events-none opacity-20">
            <p className="text-xs font-mono">
              {user.email} • PROTECTED
            </p>
          </div>
        )}

        {isLocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-center p-6">
            <Lock size={40} className="text-orange-500 mb-4" />
            <h2 className="text-xl font-bold mb-4">
              Premium Content
            </h2>
            <BuyCourseButton courseId={courseId} />
          </div>
        ) : (
          <>
            <iframe
              className="w-full h-full"
              src={iframeSrc}
              title="Lecture Player"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
            <div className="absolute inset-0 bg-transparent z-20" />
          </>
        )}
      </div>

      <div className="shrink-0 mx-4 mb-4 flex justify-between items-center">
        <button
          disabled={!prevLecture}
          onClick={() =>
            navigate(`/course/${courseId}/lecture/${prevLecture?._id}`)
          }
          className="p-3 bg-zinc-800 rounded-full disabled:opacity-40"
        >
          <ChevronLeft size={20} />
        </button>

        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="bg-orange-600 hover:bg-orange-500 px-6 py-2 rounded-full flex items-center gap-2 font-semibold"
          >
            <Play size={18} />
            Play
          </button>
        )}

        {isPlaying && (
          <button
            onClick={handleManualComplete}
            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full font-semibold"
          >
            Mark Complete
          </button>
        )}

        <button
          disabled={!nextLecture}
          onClick={() =>
            navigate(`/course/${courseId}/lecture/${nextLecture?._id}`)
          }
          className="p-3 bg-white text-black rounded-full disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default LecturePlayer;
