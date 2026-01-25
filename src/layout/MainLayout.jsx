import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    /**
     * ✅ h-screen: Poore layout ko window height pe lock kar diya.
     * ✅ overflow-hidden: Bahar ka ganda scroll forcefully band.
     */
    <div className="h-screen flex flex-col  bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      
      <main flex-1>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;