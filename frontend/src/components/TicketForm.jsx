import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const TicketForm = ({ ticket = null }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: ticket?.title || "",
        description: ticket?.description || "",
        category: ticket?.category || "Technical",
        priority: ticket?.priority || "Medium"
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (ticket) {
                await api.put(`/tickets/${ticket._id}`, formData);
                toast.success("Ticket updated successfully");
                navigate(`/tickets/${ticket._id}`);
            } else {
                const { data } = await api.post("/tickets", formData);
                toast.success("Ticket submitted successfully");
                navigate(`/tickets/${data.ticket._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to save ticket");
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = "mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

    return (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <label className="text-sm font-semibold text-slate-700">Ticket title</label>
                <input name="title" value={formData.title} onChange={handleChange} required minLength={5} maxLength={120} placeholder="Briefly describe your issue" className={fieldClass} />
            </div>
            <div>
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required minLength={10} rows={6} maxLength={5000} placeholder="Explain what happened and what you expected..." className={fieldClass} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className={fieldClass}>
                        {["Technical", "Account", "Billing", "General", "Other"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className={fieldClass}>
                        {["Low", "Medium", "High", "Urgent"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button disabled={loading} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
                    {loading ? "Saving..." : ticket ? "Save changes" : "Submit ticket"}
                </button>
            </div>
        </form>
    );
};

export default TicketForm;
