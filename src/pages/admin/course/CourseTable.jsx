import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit, Plus, BookOpen, Clock, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

const CourseTable = () => {
  const { data, isLoading, isError } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState />;

  const courses = data?.courses || [];

  return (
    /**
     * ✅ LAPTOP (md:h-screen + overflow-hidden): Page lock rahega.
     * ✅ MOBILE (min-h-screen): Scroll allow karega taaki content na kate.
     */
    <div className="flex-1 bg-white dark:bg-[#0A0A0A] transition-all duration-300 md:h-screen min-h-screen flex flex-col md:overflow-hidden">
      
      {/* 1. HEADER SECTION (Mobile par scroll hoga, Laptop par fixed rahega) */}
      <div className="flex-none pt-24 md:pt-20 px-4 md:px-12 pb-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 shrink-0">
              <LayoutGrid className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase italic">
                Course <span className="text-blue-600">Inventory</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1">
                Manage {courses.length} courses
              </p>
            </div>
          </div>

          <Button 
            onClick={() => navigate("create")} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Course
          </Button>
        </div>
      </div>

      {/* 2. SCROLLABLE AREA: Laptop par sirf ye scroll hoga, Mobile par ye normal behave karega */}
      <div className="flex-1 md:overflow-y-auto no-scrollbar px-4 md:px-12 pb-10">
        <div className="max-w-7xl mx-auto">
          
          {/* MOBILE VIEW: List (Isme hamesha scroll chalega) */}
          <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
            {courses.length === 0 ? <EmptyState /> : courses.map((course) => (
              <div key={course._id} className="bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <Badge className={`rounded-lg px-2 py-0.5 uppercase text-[8px] font-black border-none ${course.isPublished ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <span className="font-black text-blue-600">
                      {course.coursePrice ? `₹${course.coursePrice}` : "FREE"}
                    </span>
                 </div>
                 <h3 className="font-bold text-zinc-800 dark:text-zinc-100 mb-4 line-clamp-1">{course.courseTitle}</h3>
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-bold flex items-center gap-1">
                      <Clock size={12} /> {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                    <Button size="sm" onClick={() => navigate(`${course._id}`)} className="rounded-xl bg-white dark:bg-zinc-800 border dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-blue-600 hover:text-white transition-all">
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                 </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table (Isme list badhne par scroll ayega) */}
          <div className="hidden md:block bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden mb-10">
            <Table>
              <TableHeader className="bg-zinc-100/50 dark:bg-zinc-800/50">
                <TableRow className="border-b dark:border-zinc-800 hover:bg-transparent">
                  <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest h-14 text-zinc-500">Price</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-zinc-500">Status</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-zinc-500">Course Title</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest text-zinc-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? <EmptyState isTable /> : courses.map((course) => (
                  <TableRow key={course._id} className="group hover:bg-white dark:hover:bg-zinc-800/40 transition-colors border-b dark:border-zinc-800">
                    <TableCell className="pl-8 font-black text-blue-600 py-5">
                      {course.coursePrice ? `₹${course.coursePrice}` : "FREE"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-lg px-3 py-1 uppercase text-[9px] font-black ${course.isPublished ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-700"}`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-zinc-700 dark:text-zinc-200">{course.courseTitle}</TableCell>
                    <TableCell className="text-right pr-8">
                      <Button size="icon" variant="ghost" className="rounded-xl hover:bg-blue-600 hover:text-white transition-all" onClick={() => navigate(`${course._id}`)}>
                        <Edit size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- States remains same --- */
const EmptyState = ({ isTable }) => (
  <div className="flex flex-col items-center justify-center py-20 opacity-30">
    <BookOpen size={48} className="mb-4 text-zinc-400" />
    <p className="font-black uppercase tracking-widest text-[10px]">No courses found</p>
  </div>
);

const ErrorState = () => (
  <div className="flex items-center justify-center h-screen pt-20">
    <div className="p-10 bg-red-50 dark:bg-red-950/10 rounded-[2rem] border border-red-100 text-center">
      <p className="text-red-600 font-black uppercase text-xs tracking-widest">Error Loading Inventory</p>
      <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl">Retry</Button>
    </div>
  </div>
);

export default CourseTable;