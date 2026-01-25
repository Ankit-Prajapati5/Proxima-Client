import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateProfileMutation } from "@/features/api/authApi";
import Course from "./Course";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Mail,
  User,
  ShieldCheck,
  PenSquare,
  LayoutGrid,
  ArrowRightCircle,
  Info,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully");
      setOpen(false);
      setProfilePhoto(null);
      setOldPassword("");
      setNewPassword("");
    }
    if (isError) toast.error(error?.data?.message || "Update failed");
  }, [isSuccess, isError, error]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) setProfilePhoto(file);
    else toast.error("Please select a valid image");
  };

  const updateUserHandler = async () => {
    if (newPassword && !oldPassword) {
      return toast.error("Purana password daalna zaroori hai!");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (oldPassword) formData.append("oldPassword", oldPassword);
    if (newPassword) formData.append("newPassword", newPassword);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    await updateUser(formData);
  };
if (!user) return <ProfileSkeleton />;
  return (
    <div className="bg-[#f8fafc] dark:bg-zinc-950 lg:h-screen w-full pt-20 lg:pt-24 flex flex-col transition-colors duration-500 font-sans overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* LEFT COLUMN: PROFILE INFO */}
        <div className="lg:col-span-5 h-full overflow-y-auto px-6 lg:px-12 py-8 no-scrollbar border-r border-zinc-100 dark:border-zinc-900">
          <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
            <header>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic uppercase">
                Account<span className="text-blue-600">.</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium italic">Update your personal details here.</p>
            </header>

            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
              <div className="flex flex-col items-center text-center space-y-6">
                
                <div className="relative">
                  <div className="h-32 w-32 md:h-44 md:w-44 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-2xl flex items-center justify-center overflow-hidden">
                    <Avatar className="h-full w-full border-4 border-white dark:border-zinc-900 rounded-full overflow-hidden">
                      <AvatarImage
                        src={user.photoUrl || "https://github.com/shadcn.png"}
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback className="text-4xl font-black bg-zinc-100 dark:bg-zinc-800 uppercase">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full border-4 border-white dark:border-zinc-900 shadow-lg">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="grid gap-3 w-full">
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
                    <div className="text-left min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-[0.1em] mb-1">Full Name</span>
                      <p className="font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                    </div>
                    <User className="text-zinc-300 dark:text-zinc-700 flex-shrink-0" size={18} />
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
                    <div className="text-left min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-[0.1em] mb-1">Email Address</span>
                      <p className="font-bold text-zinc-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    <Mail className="text-zinc-300 dark:text-zinc-700 flex-shrink-0" size={18} />
                  </div>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-7 rounded-2xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all">
                      <PenSquare size={14} className="mr-2" /> Edit Information
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2.5rem] dark:bg-zinc-950 border-zinc-800 shadow-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Edit Profile</DialogTitle>
                      <DialogDescription className="text-xs">Update your identity and password.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-5 py-4">
                      <div className="space-y-3">
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="rounded-xl h-12" />
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="rounded-xl h-12" />
                      </div>

                      {/* PASSWORD SECTION */}
                      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Lock size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Security</span>
                        </div>
                        
                        <div className="relative">
                          <Input 
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            placeholder="Current Password (Required to change)" 
                            className="rounded-xl h-12 pr-10" 
                          />
                          <button onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-3.5 text-zinc-400">
                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>

                        <div className="relative">
                          <Input 
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="New Password" 
                            className="rounded-xl h-12 pr-10" 
                          />
                          <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3.5 text-zinc-400">
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Profile Photo</label>
                        <Input type="file" accept="image/*" onChange={onFileChange} className="rounded-xl border-dashed border-2 cursor-pointer h-12 pt-2.5" />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button onClick={updateUserHandler} disabled={isLoading} className="w-full py-6 rounded-xl bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-widest text-xs">
                        {isLoading ? "Saving..." : "Confirm Update"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full py-9 rounded-[2rem] bg-zinc-900 dark:bg-zinc-800 text-white font-black flex items-center justify-between px-8 shadow-xl group">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                        <LayoutGrid size={20} className="text-white" />
                      </div>
                      <span className="text-sm tracking-widest uppercase">My Courses</span>
                    </div>
                    <ArrowRightCircle size={24} className="text-blue-500" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-[3rem] px-6 pt-10 bg-white dark:bg-zinc-950 overflow-y-auto no-scrollbar border-t-4 border-blue-600">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-3xl font-black italic uppercase tracking-tighter">Current Journey</SheetTitle>
                  </SheetHeader>
                  <EnrolledGrid courses={user.enrolledCourses} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ENROLLED COURSES */}
        <div className="hidden lg:block lg:col-span-7 h-full bg-[#f1f5f9]/50 dark:bg-zinc-900/20 p-12 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
                Enrolled Courses<span className="text-blue-600">.</span>
              </h2>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-[10px] font-black uppercase tracking-widest">{user.enrolledCourses?.length} Courses</span>
                <Info size={16} />
              </div>
            </div>
            <EnrolledGrid courses={user.enrolledCourses} />
          </div>
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

const EnrolledGrid = ({ courses }) =>
  !courses || courses.length === 0 ? (
    <div className="h-80 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center px-10">
      <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-full mb-4 text-zinc-300">
        <LayoutGrid size={40} />
      </div>
      <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-xs">Abhi tak koi course enroll nahi kiya hai bhai!</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
      {courses.map((course) => (
        <Course key={course._id} course={course} />
      ))}
    </div>
  );

export default Profile;

function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <Skeleton className="h-[600px] rounded-[3rem]" />
      <Skeleton className="h-[600px] rounded-[3rem] hidden lg:block" />
    </div>
  );
}