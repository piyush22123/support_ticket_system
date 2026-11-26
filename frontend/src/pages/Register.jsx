import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            toast.success("Account created successfully");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-brand-600">GET STARTED</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900">Create your account</h1>
                <p className="mt-2 text-sm text-slate-500">Submit and track your support tickets.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="text-sm font-semibold">Full name</label>
                        <input required minLength={2} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Email address</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Password</label>
                        <input type="password" required minLength={8} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" placeholder="At least 8 characters" />
                    </div>
                    <button disabled={loading} className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-brand-600">Sign in</Link></p>
            </div>
        </div>
    );
};

export default Register;
