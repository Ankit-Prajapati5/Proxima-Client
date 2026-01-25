import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2, PlusCircle, ArrowLeft, BookOpen, IndianRupee, Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coursePrice, setCoursePrice] = useState("");

  const [createCourse, { isLoading, error, isSuccess }] = useCreateCourseMutation();
  const navigate = useNavigate();

  const createCourseHandler = async () => {
    if (!courseTitle || !category || !coursePrice) {
      toast.error("Bhai, Details bharna zaroori hai!");
      return;
    }
    await createCourse({ courseTitle, category, coursePrice: Number(coursePrice) });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Mubarak ho! Course ban gaya.");
      navigate("/admin/course");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-[#0A0A0A] md:h-[calc(100vh-64px)] min-h-screen flex flex-col md:overflow-hidden transition-all duration-300">
      
      {/* Scrollable Wrapper */}
      <div className="flex-1 overflow-y-auto pt-20 md:pt-12 px-4 md:px-10 pb-10 custom-scrollbar">
        
        {/* Header Section: Mobile pe stack hoga, Laptop pe row */}
        <div className="max-w-4xl mx-auto mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-black text-xl md:text-3xl tracking-tight uppercase italic flex items-center gap-2 text-zinc-900 dark:text-white">
              <PlusCircle className="text-blue-600 shrink-0" size={24} md:size={28} />
              Create <span className="text-blue-600">New Course</span>
            </h1>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-1 font-medium uppercase tracking-wider">
              Launch your next masterpiece.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/admin/course")}
            className="rounded-xl border-zinc-200 dark:border-zinc-800 w-fit text-xs md:text-sm"
          >
            <ArrowLeft size={14} className="mr-2" /> Back
          </Button>
        </div>

        {/* Main Form Card: Padding mobile pe kam (p-5), laptop pe zyada (p-10) */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-xl shadow-blue-500/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Title Input */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2">
                <BookOpen size={14} className="text-blue-600" /> Course Title
              </Label>
              <Input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Master MERN Stack"
                className="rounded-xl md:rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-zinc-950 border-none text-base md:text-lg font-semibold"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2">
                <Layers size={14} className="text-blue-600" /> Category
              </Label>
              <Select onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl md:rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-zinc-950 border-none font-medium">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="nextjs">Next.js</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="fullstack">Fullstack</SelectItem>
                  <SelectItem value="mern">MERN Stack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2">
                <IndianRupee size={14} className="text-blue-600" /> Price
              </Label>
              <Input
                type="number"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                placeholder="999"
                className="rounded-xl md:rounded-2xl h-12 md:h-14 bg-slate-50 dark:bg-zinc-950 border-none font-bold text-lg md:text-xl text-blue-600"
              />
            </div>

            {/* Quick Note: Mobile pe height auto rahegi */}
            <div className="p-4 md:p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl md:rounded-3xl border border-blue-100/50 flex items-center">
              <p className="text-[10px] md:text-[11px] text-blue-600 dark:text-blue-400 italic leading-snug">
                <strong>Note:</strong> Pricing is set in INR. You can add videos, thumbnails, and curriculum in the edit section later.
              </p>
            </div>
          </div>

          {/* Buttons: Mobile pe full width (flex-col-reverse), Laptop pe row */}
          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-50 dark:border-zinc-800 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
            <Button 
              variant="ghost" 
              className="rounded-xl md:rounded-2xl px-8 h-12 md:h-14 font-bold text-zinc-500" 
              onClick={() => navigate("/admin/course")}
            >
              Cancel
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={createCourseHandler}
              className="rounded-xl md:rounded-2xl px-10 h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wait</>
              ) : (
                "Launch Course"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;