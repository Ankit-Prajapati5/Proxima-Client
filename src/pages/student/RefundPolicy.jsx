import React from 'react';
import { Infinity, Ban, Lock, Rocket, Sparkles, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const RefundAndCancellation = () => {
  const navigate = useNavigate();

  const policies = [
    {
      icon: <Infinity size={22} />,
      title: "Lifetime Access",
      content: "Ek baar purchase karne ke baad, course aapka hai—hamesha ke liye. No monthly fees."
    },
    {
      icon: <Ban size={22} />,
      title: "No Refund Policy",
      content: "Digital content ki nature ki wajah se, hum purchase ke baad refund allow nahi karte."
    },
    {
      icon: <Rocket size={22} />,
      title: "Instant Delivery",
      content: "Payment hote hi aapko saara premium content instantly unlock ho jata hai."
    },
    {
      icon: <Lock size={22} />,
      title: "Secure Payment",
      content: "Aapki transactions 100% encrypted hain. Hum sirf trusted gateways use karte hain."
    }
  ];

  return (
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 text-zinc-900 dark:text-white lg:h-screen w-full pt-20 lg:pt-0 flex items-center justify-center transition-colors duration-500 relative font-sans overflow-hidden">
      
      {/* Background Blobs - Professional Blue/Zinc theme */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-zinc-200/20 dark:bg-zinc-900/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={12} /> Membership Terms
            </p>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
            Access <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-white dark:to-zinc-500">
              Forever.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 font-medium max-w-sm mx-auto lg:mx-0 leading-relaxed">
            Hum quality content aur lifetime access par believe karte hain. Isliye hamari "No-Refund" policy hamare commitment ka hissa hai.
          </p>

          <div className="pt-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-zinc-200 dark:border-zinc-800 h-12 px-6 text-[11px] font-black tracking-widest rounded-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-md"
            >
              <ArrowLeft size={16} className="mr-2" /> UNDERSTOOD, GO BACK
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-700">
          
          {policies.map((item, index) => (
            <div key={index} className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-white dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm hover:border-blue-500/50 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black mb-4 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{item.title}</h3>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-snug font-medium">
                {item.content}
              </p>
            </div>
          ))}

          {/* Critical Policy Card */}
          <div className="sm:col-span-2 bg-zinc-950 text-white p-5 rounded-[2rem] flex items-center gap-5 relative overflow-hidden shadow-2xl border border-zinc-800">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-red-500/10 items-center justify-center shrink-0 border border-red-500/20">
               <ShieldAlert size={20} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-400 leading-relaxed">
                "Purchase karne se pehle demos aur course syllabus dhyan se check karein. Ek baar content access hone ke baad refund claim nahi kiya ja sakta."
              </p>
              <div className="mt-2 flex gap-6 text-[9px] font-black uppercase tracking-widest">
                <span className="text-red-500">Strict: No-Refund Policy</span>
                <span className="text-zinc-700">ID: AC-LIFETIME-01</span>
              </div>
            </div>
          </div>

          {/* Minimal Status Bar */}
          <div className="sm:col-span-2 py-3 px-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex justify-between items-center bg-white/20 dark:bg-transparent backdrop-blur-sm">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Final Sale Policy
             </span>
             <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Lifetime Validity</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RefundAndCancellation;