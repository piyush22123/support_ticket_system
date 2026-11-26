import { LifeBuoy, LogOut, Ticket, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            toast.error("Unable to logout");
        }
    };

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-2">
                    <span className="rounded-xl bg-brand-600 p-2 text-white"><LifeBuoy size={22} /></span>
                    <span className="text-xl font-bold tracking-tight text-slate-900">HelpDesk</span>
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="hidden items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 sm:flex">
                            <Ticket size={17} /> My tickets
                        </Link>
                        {user.role === "admin" && (
                            <Link to="/admin" className="text-sm font-semibold text-brand-600">Admin</Link>
                        )}
                        <div className="hidden items-center gap-2 text-sm text-slate-600 md:flex">
                            <UserCircle size={19} />
                            <span>{user.name}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Login</Link>
                        <Link to="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Create account</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
