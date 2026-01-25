import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
    </div>
  );
};

export default Loader;
