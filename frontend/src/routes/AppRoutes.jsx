import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateTicket from "../pages/CreateTicket";
import EditTicket from "../pages/EditTicket";
import TicketDetails from "../pages/TicketDetails";
import AdminDashboard from "../pages/AdminDashboard";
import AdminTicketDetails from "../pages/AdminTicketDetails";

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"} replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tickets/new" element={<CreateTicket />} />
                    <Route path="/tickets/:id" element={<TicketDetails />} />
                    <Route path="/tickets/:id/edit" element={<EditTicket />} />
                </Route>

                <Route element={<ProtectedRoute adminOnly />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/tickets/:id" element={<AdminTicketDetails />} />
                </Route>

                <Route path="*" element={<div className="p-16 text-center text-slate-500">Page not found</div>} />
            </Routes>
        </>
    );
};

export default AppRoutes;
