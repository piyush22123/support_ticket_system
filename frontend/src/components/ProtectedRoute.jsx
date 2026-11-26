import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading your account...</div>;
    }

    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
