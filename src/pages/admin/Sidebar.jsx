import { ChartNoAxesColumn, SquareLibrary, LayoutDashboard, LogOut } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { authApi, useLogoutMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { courseApi } from "@/features/api/courseApi";

const Sidebar = () => {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Styles for Laptop Sidebar
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
     ${isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
        : "text-zinc-500 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-blue-600"
     }`;

  // Styles for Mobile Sticky Tabs
  const mobileLinkClass = ({ isActive }) =>
    `flex flex-1 items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-tight
     ${isActive 
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800"
     }`;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-black">
      
      {/* 📱 MOBILE NAVIGATION (Visible only on Mobile, Sticky below Navbar) */}
      <div className="lg:hidden sticky top-[64px] z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-2 px-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <NavLink to="dashboard" className={mobileLinkClass}>
            <LayoutDashboard size={14} />
            <span>Stats</span>
          </NavLink>

          <NavLink to="course" className={mobileLinkClass}>
            <SquareLibrary size={14} />
            <span>Courses</span>
          </NavLink>

         <Link to="/"> <button 
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase bg-red-50 dark:bg-red-900/10 text-red-500 border border-red-100 dark:border-red-900/20"
          >
            <LogOut size={14} />
            <span>Exit</span>
          </button></Link>
        </div>
      </div>

      {/* 🖥️ DESKTOP SIDEBAR (Laptop Screens) */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl p-6 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
        <div className="flex-1 space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Main Menu</p>
          
          <NavLink to="dashboard" className={linkClass}>
            <LayoutDashboard size={20} />
            <span className="font-bold uppercase tracking-tight text-sm">Dashboard</span>
          </NavLink>

          <NavLink to="course" className={linkClass}>
            <SquareLibrary size={20} />
            <span className="font-bold uppercase tracking-tight text-sm">Manage Courses</span>
          </NavLink>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-500 transition-all font-bold uppercase text-sm tracking-tight group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 pt-8 lg:pt-12">
        <div className="max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Sidebar;