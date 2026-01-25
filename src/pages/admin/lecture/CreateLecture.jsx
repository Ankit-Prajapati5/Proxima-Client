import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2, Plus, ArrowLeft, Video, LayoutList } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";
import LoadingSpinner from "@/components/LoadingSpinner";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [createLecture, { isLoading: creating, isSuccess, error }] = useCreateLectureMutation();
  const { data: lectureData, isLoading: lectureLoading, isError: lectureError, refetch } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Pehle lecture ka naam toh likho bhai!");
      return;
    }
    try {
      await createLecture({ lectureTitle: lectureTitle.trim(), courseId }).unwrap();
    } catch { /* Error handled in useEffect */ }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Lecture add ho gaya!");
      setLectureTitle("");
      refetch();
    }
    if (error) {
      toast.error(error?.data?.message || "Lecture banane mein locha hua");
    }
  }, [isSuccess, error, refetch]);

  return (
    <div className="flex-1 min-h-screen bg-slate-50/50 dark:bg-transparent pb-20">
      
      {/* 🚀 HEADER SECTION */}
      <div className="pt-24 md:pt-10 px-4 md:px-10 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-black text-2xl md:text-3xl tracking-tight uppercase italic flex items-center gap-3">
              <Video className="text-blue-600" size={28} />
              Curriculum <span className="text-blue-600">Builder</span>
            </h1>
            <p className="text-[10px] md:text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">
              Course Content & Video Management
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="w-fit rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 shadow-sm transition-all"
          >
            <ArrowLeft size={16} className="mr-2" /> <span className="text-xs uppercase font-black">Back to Course</span>
          </Button>
        </div>
      </div>

      {/* 📝 INPUT FORM SECTION */}
      <div className="px-4 md:px-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-blue-500/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">New Lecture Title</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  placeholder="e.g. Introduction to React Context API"
                  className="flex-1 rounded-xl h-12 md:h-14 bg-slate-50 dark:bg-zinc-950 border-none font-semibold text-base px-5 focus-visible:ring-2 focus-visible:ring-blue-600"
                />
                <Button 
                  disabled={creating} 
                  onClick={createLectureHandler}
                  className="rounded-xl h-12 md:h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  {creating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                  Add Lecture
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 📚 LECTURES LIST AREA */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex items-center gap-2 mb-6 px-2">
            <LayoutList size={18} className="text-blue-600" />
            <h2 className="font-black uppercase tracking-tighter text-lg">Course <span className="text-blue-600">Modules</span></h2>
            <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800 ml-4"></div>
          </div>

          <div className="space-y-4">
            {lectureLoading ? (
              <div className="flex flex-col items-center py-20">
                <LoadingSpinner />
                <p className="text-[10px] font-bold uppercase tracking-widest mt-4 text-zinc-400">Loading Lectures...</p>
              </div>
            ) : lectureError ? (
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 text-center">
                <p className="text-red-500 font-bold uppercase text-[10px]">Failed to load lectures</p>
              </div>
            ) : lectureData?.lectures?.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-16 text-center">
                <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="text-zinc-400" size={24} />
                </div>
                <p className="font-bold text-zinc-500 uppercase text-[10px] tracking-widest">No lectures added yet</p>
                <p className="text-xs text-zinc-400 mt-1">Start by adding your first module above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {lectureData.lectures.map((lecture, index) => (
                  <Lecture
                    key={lecture._id}
                    courseId={courseId}
                    lecture={lecture}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;