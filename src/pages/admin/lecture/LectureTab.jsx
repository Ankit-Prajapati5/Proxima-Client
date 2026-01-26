import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import {
  Loader2,
  Trash2,
  Video,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const LectureTab = () => {
  const { id: courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetLectureByIdQuery({
    courseId,
    lectureId,
  });

  const lecture = data?.lecture;

  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [editLecture, { isLoading: updating }] =
    useEditLectureMutation();
  const [removeLecture, { isLoading: removing }] =
    useRemoveLectureMutation();

  // Extract Video ID
  const extractVideoId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsPreviewFree(Boolean(lecture.isPreviewFree));
      if (lecture.videoId) {
        setYoutubeUrl(
          `https://www.youtube.com/watch?v=${lecture.videoId}`
        );
      }
    }
  }, [lecture]);

  const updateLectureHandler = async () => {
    if (!lectureTitle.trim())
      return toast.error("Lecture title required!");

    const videoId = extractVideoId(youtubeUrl);

    if (!videoId)
      return toast.error("Valid YouTube URL daalo!");

    try {
      await editLecture({
        courseId,
        lectureId,
        data: {
          lectureTitle: lectureTitle.trim(),
          isPreviewFree,
          videoId,
        },
      }).unwrap();

      toast.success("Lecture updated successfully!");
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-5 rounded-2xl border">
        <h2 className="font-black uppercase text-sm">
          Lecture Editor
        </h2>

        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            if (window.confirm("Delete lecture?")) {
              await removeLecture({ courseId, lectureId });
              navigate(`/admin/course/${courseId}/lecture`);
            }
          }}
        >
          {removing ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Trash2 size={14} />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border">
          <div>
            <Label>Lecture Title</Label>
            <Input
              value={lectureTitle}
              onChange={(e) =>
                setLectureTitle(e.target.value)
              }
              placeholder="Enter title..."
            />
          </div>

          <div>
            <Label>YouTube Video URL</Label>
            <Input
              value={youtubeUrl}
              onChange={(e) =>
                setYoutubeUrl(e.target.value)
              }
              placeholder="Paste YouTube link"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Smartphone size={16} />
              <p className="text-xs font-bold">
                Free Preview
              </p>
            </div>
            <Switch
              checked={isPreviewFree}
              onCheckedChange={setIsPreviewFree}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="bg-black rounded-2xl p-2">
            <div className="aspect-video">
              {extractVideoId(youtubeUrl) ? (
                <iframe
                  className="w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    youtubeUrl
                  )}?rel=0&modestbranding=1&controls=1`}
                  title="Lecture Preview"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-white text-sm">
                  <Video className="mr-2" size={16} />
                  No Video
                </div>
              )}
            </div>
          </div>

          <Button
            disabled={updating}
            onClick={updateLectureHandler}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {updating ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <CheckCircle className="mr-2" size={16} />
            )}
            {updating ? "Saving..." : "Update Lecture"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LectureTab;
