import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";

const Course = ({ course }) => {
  // Level ke hisaab se color choose karne ke liye logic
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'intermediate': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'advance': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default: return 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800';
    }
  };

  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="group overflow-hidden rounded-[2.5rem] dark:bg-zinc-900 bg-white border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 transition-all duration-500 font-sans relative">
        
        {/* THUMBNAIL */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={course.courseThumbnail || "https://placehold.co/600x400?text=No+Thumbnail"}
            alt={course.courseTitle}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <CardContent className="px-7 py-6 space-y-5">
          {/* TITLE */}
          <h2 className="font-black text-xl tracking-tight text-zinc-900 dark:text-white line-clamp-2 leading-[1.1] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors h-12">
            {course.courseTitle}
          </h2>

          {/* INSTRUCTOR PROFILE & LEVEL BADGE (Dono saath mein) */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-md">
                  <AvatarImage src={course.creator?.photoUrl} />
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                    {course.creator?.name?.[0] || <User size={14}/>}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 leading-none mb-1">
                  Instructor
                </span>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[100px]">
                  {course.creator?.name || "Premium Mentor"}
                </span>
              </div>
            </div>

            {/* BADGE MOVED HERE: Instructor ke bagal mein */}
            <Badge className={`border px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm whitespace-nowrap ${getLevelColor(course.courseLevel)}`}>
              {course.courseLevel || "Beginner"}
            </Badge>
          </div>

          <div className="h-[1px] w-full bg-zinc-100 dark:bg-zinc-800/50" />

          {/* BOTTOM ROW: PRICE & CTA */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">Price</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                  {course.coursePrice ? "₹" : ""}
                </span>
                <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
                  {course.coursePrice || "FREE"}
                </span>
              </div>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
              <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;