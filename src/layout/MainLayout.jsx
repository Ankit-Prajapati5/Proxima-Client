import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0A0A]">
      
      <ScrollToTop />   {/* 🔥 scroll fix */}

      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
