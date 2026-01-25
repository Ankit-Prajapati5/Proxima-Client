import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import { Loader2, Trash2, CloudUpload, Video, Info, CheckCircle, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const LectureTab = () => {
  const { id: courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetLectureByIdQuery({ courseId, lectureId });
  const lecture = data?.lecture;

  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState("");

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsPreviewFree(Boolean(lecture.isPreviewFree));
    }
  }, [lecture]);

  const [editLecture, { isLoading: updating }] = useEditLectureMutation();
  const [removeLecture, { isLoading: removing }] = useRemoveLectureMutation();

  const updateLectureHandler = async () => {
    if (!lectureTitle.trim()) return toast.error("Title toh daalo bhai!");
    try {
      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle.trim());
      formData.append("isPreviewFree", isPreviewFree);
      if (videoFile) formData.append("video", videoFile);
      await editLecture({ courseId, lectureId, formData }).unwrap();
      toast.success("Lecture updated!");
      setVideoFile(null);
      setVideoName("");
    } catch (error) {
      toast.error("Update fail ho gaya.");
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Loading Editor...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-full overflow-hidden">
      
      {/* 🛑 HEADER: Sticky-friendly & Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
            Lecture <span className="text-blue-600">Editor</span>
          </h2>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Status: Editing Mode</p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            if(window.confirm("Delete kar dein?")) {
              await removeLecture({ courseId, lectureId });
              navigate(`/admin/course/${courseId}/lecture`);
            }
          }}
          className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 shadow-lg shadow-red-500/10 active:scale-95 transition-all"
        >
          {removing ? <Loader2 className="animate-spin mr-2" size={14} /> : <Trash2 size={14} className="mr-2" />}
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* 📝 LEFT: FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-5 md:p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 space-y-6">
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Lecture Title</Label>
              <Input
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-bold text-md px-5 focus-visible:ring-2 focus-visible:ring-blue-600"
                placeholder="Enter title..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Video Content</Label>
              <div className="relative group h-40 w-full">
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setVideoFile(file); setVideoName(file.name); }
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 group-hover:bg-blue-50/30 transition-all pointer-events-none">
                  <CloudUpload className={`${videoName ? 'text-blue-600' : 'text-zinc-300'}`} size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">
                    {videoName ? videoName.slice(0,25) : "Tap to upload video"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Smartphone className="text-blue-600" size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest">Free Preview</p>
              </div>
              <Switch checked={isPreviewFree} onCheckedChange={setIsPreviewFree} className="data-[state=checked]:bg-blue-600 scale-90" />
            </div>
          </div>
        </div>

        {/* 🎬 RIGHT: PREVIEW & SAVE (THE FIX) */}
        <div className="space-y-4">
          <div className="bg-zinc-950 rounded-[1.5rem] p-2 shadow-xl border-4 border-zinc-100 dark:border-zinc-800">
             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2 text-center">Video Monitor</p>
             
             {/* 📺 RATIO FIX: object-contain is key here */}
             <div className="relative aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                {lecture.videoUrl || videoFile ? (
                   <video 
                     key={lecture.videoUrl} // Key helps reload video on URL change
                     src={videoFile ? URL.createObjectURL(videoFile) : lecture.videoUrl} 
                     controls 
                     className="w-full h-full object-contain bg-black" 
                   />
                ) : (
                  <div className="text-center">
                    <Video size={24} className="text-zinc-800 mx-auto mb-1" />
                    <p className="text-[8px] font-bold text-zinc-700 uppercase">No Media</p>
                  </div>
                )}
             </div>
          </div>

          <Button
            disabled={updating}
            onClick={updateLectureHandler}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            {updating ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle className="mr-2" size={16} />}
            {updating ? "Saving..." : "Update Module"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default LectureTab;