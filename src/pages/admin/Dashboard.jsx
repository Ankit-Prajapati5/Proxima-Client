import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  BadgeDollarSign, 
  TrendingUp, 
  LayoutDashboard, 
  ArrowUpRight,
  GraduationCap,
  Loader2,
  Calendar,
  CreditCard,
  ShieldCheck,
  Mail,
  Zap
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetDashboardStatsQuery } from "@/features/api/courseApi"; 

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const [selectedEnrolment, setSelectedEnrolment] = useState(null);

  // Data destructuring
  const { 
    totalRevenue = 0, 
    totalStudents = 0, 
    activeCourses = 0, 
    totalSales = 0, 
    recentEnrolments = [] 
  } = data || {};

  // Stats for the top grid
  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: BadgeDollarSign, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Total Students", value: totalStudents, icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Active Courses", value: activeCourses, icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Course Sales", value: totalSales, icon: GraduationCap, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 animate-pulse">Fetching Real-time Stats...</p>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full">
        <Zap className="text-red-500" size={32} />
      </div>
      <p className="font-black uppercase italic tracking-tighter text-red-500">Database Connection Error!</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 dark:bg-transparent min-h-screen pt-[calc(env(safe-area-inset-top)+72px)]">
      
      {/* 🚀 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase italic">
            Admin <span className="text-blue-600">Console</span>
          </h1>
          <p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">
            Real-time analytics & student activity
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Live Server</span>
        </div>
      </div>

      {/* 📊 STATS CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <Card key={index} className="border-none shadow-xl shadow-blue-500/5 rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white dark:bg-zinc-900 border border-transparent hover:border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                   <ArrowUpRight size={12} />
                   <span className="text-[10px] font-bold">Live</span>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</p>
              <h3 className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{item.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* RECENT ENROLMENTS LIST */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-50 dark:border-zinc-800 pb-6 px-8 pt-8">
            <div>
              <CardTitle className="text-lg font-black uppercase italic tracking-tighter">Recent <span className="text-blue-600">Enrolments</span></CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Click entry to view details</CardDescription>
            </div>
            <LayoutDashboard size={20} className="text-zinc-300" />
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                {recentEnrolments.length > 0 ? recentEnrolments.map((enrolment) => (
                  <div 
                    key={enrolment._id} 
                    onClick={() => setSelectedEnrolment(enrolment)}
                    className="flex items-center justify-between p-5 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 px-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:rotate-12 transition-transform">
                        {enrolment.studentName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-200">{enrolment.studentName}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5 tracking-widest">{enrolment.courseTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-blue-600 italic">₹{enrolment.amount}</span>
                      <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                )) : (
                  <div className="p-16 text-center text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">No activity found in database.</div>
                )}
             </div>
          </CardContent>
        </Card>

        {/* FINANCIAL TARGET CARD */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-zinc-950 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <TrendingUp size={120} />
          </div>
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-lg font-black uppercase tracking-widest text-blue-400 italic">Goal Tracker</CardTitle>
            <CardDescription className="text-zinc-500 font-bold uppercase text-[10px]">Monthly Target: ₹50,000</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
             <div className="text-4xl font-black tracking-tighter italic">₹{totalRevenue.toLocaleString()} / <span className="text-zinc-600 text-2xl">₹50k</span></div>
             <div className="w-full bg-zinc-900 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min((totalRevenue / 50000) * 100, 100)}%` }}
                ></div>
             </div>
             <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
               <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed italic">
                 {totalRevenue >= 50000 ? "Congratulations! Target Achieved." : `Reach ₹50k to unlock new instructor rewards.`}
               </p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* 🧾 ENROLMENT DETAILS DIALOG */}
      <Dialog open={!!selectedEnrolment} onOpenChange={() => setSelectedEnrolment(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none bg-white dark:bg-zinc-950 p-0 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
          <div className="bg-blue-600 p-8 text-white relative">
            <ShieldCheck className="absolute top-4 right-4 opacity-20" size={80} />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Payment Verified</h2>
            <p className="text-3xl font-black italic uppercase tracking-tighter mt-2">Student Receipt</p>
          </div>
          
          <div className="p-8 space-y-6">
            {/* Student Info Card */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-lg">
                {selectedEnrolment?.studentName?.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Enrolled By</p>
                <p className="font-bold text-lg leading-tight">{selectedEnrolment?.studentName}</p>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <BookOpen size={12} className="text-blue-600" /> Course Name
                </p>
                <p className="text-sm font-bold leading-tight">{selectedEnrolment?.courseTitle}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="flex items-center gap-2 justify-end text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <CreditCard size={12} className="text-blue-600" /> Amount
                </p>
                <p className="text-xl font-black text-blue-600 italic">₹{selectedEnrolment?.amount}</p>
              </div>
            </div>

            <div className="h-px bg-dashed bg-zinc-100 dark:bg-zinc-800 w-full" />

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Transaction ID</p>
                  <p className="text-[10px] font-mono font-bold text-zinc-500">{selectedEnrolment?._id?.toUpperCase()}</p>
               </div>
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Purchase Date</p>
                  <p className="text-[10px] font-bold flex items-center gap-1 text-zinc-500">
                    <Calendar size={12} /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} 
                  </p>
               </div>
            </div>

            <button 
               onClick={() => setSelectedEnrolment(null)}
               className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl hover:scale-[0.98] active:scale-95 transition-all shadow-lg"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Dashboard;