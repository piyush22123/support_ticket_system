import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const data = await login(formData);
            toast.success("Welcome back!");
            navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-brand-600">WELCOME BACK</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900">Sign in to HelpDesk</h1>
                <p className="mt-2 text-sm text-slate-500">Manage your support requests in one place.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="text-sm font-semibold">Email address</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-brand-500" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Password</label>
                        <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-brand-500" placeholder="Enter your password" />
                    </div>
                    <button disabled={loading} className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">New to HelpDesk? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link></p>
            </div>
        </div>
    );
};

export default Login;
