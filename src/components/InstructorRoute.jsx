import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const InstructorRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "instructor") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default InstructorRoute;
