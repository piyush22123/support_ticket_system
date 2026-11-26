import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

const AdminTicketDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [message, setMessage] = useState("");

    const getTicket = async () => {
        try {
            const response = await api.get(`/tickets/${id}`);
            setData(response.data);
            setStatus(response.data.ticket.status);
            setPriority(response.data.ticket.priority);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load ticket");
        }
    };

    useEffect(() => {
        getTicket();
    }, [id]);

    const updateTicket = async () => {
        try {
            await api.patch(`/admin/tickets/${id}`, { status, priority });
            toast.success("Ticket updated");
            getTicket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update ticket");
        }
    };

    const addReply = async (event) => {
        event.preventDefault();
        if (!message.trim()) return;
        try {
            await api.post(`/tickets/${id}/comments`, { message });
            setMessage("");
            toast.success("Reply added");
            getTicket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to add reply");
        }
    };

    if (!data) return <p className="p-12 text-center text-slate-500">Loading ticket...</p>;

    const { ticket, comments, activities } = data;

    return (
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <Link to="/admin" className="mb-5 inline-flex text-sm font-medium text-brand-600">← Back to dashboard</Link>
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <section className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex flex-wrap justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{ticket.category} · #{ticket._id.slice(-6).toUpperCase()}</p><StatusBadge value={ticket.status} /></div>
                        <h1 className="mt-3 text-2xl font-bold">{ticket.title}</h1>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{ticket.description}</p>
                        <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">Submitted by <b>{ticket.createdBy?.name}</b> ({ticket.createdBy?.email})</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 className="font-bold">Comments ({comments.length})</h2>
                        <div className="mt-4 space-y-3">
                            {comments.map((comment) => <div key={comment._id} className="rounded-lg bg-slate-50 p-4"><p className="text-sm font-semibold">{comment.user?.name} <span className="text-xs font-normal text-slate-400">({comment.user?.role})</span></p><p className="mt-2 text-sm leading-6 text-slate-600">{comment.message}</p></div>)}
                            {!comments.length && <p className="text-sm text-slate-500">No comments yet.</p>}
                        </div>
                        <form onSubmit={addReply} className="mt-5 border-t border-slate-100 pt-5">
                            <label className="text-sm font-semibold">Reply to user</label>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={2000} placeholder="Write a response..." className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" />
                            <div className="mt-3 flex justify-end">
                                <button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">Send reply</button>
                            </div>
                        </form>
                    </div>
                </section>
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="font-bold">Manage ticket</h2>
                    <label className="mt-5 block text-sm font-medium">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm">{["Open", "In Progress", "Resolved", "Closed"].map((item) => <option key={item}>{item}</option>)}</select>
                    <label className="mt-4 block text-sm font-medium">Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm">{["Low", "Medium", "High", "Urgent"].map((item) => <option key={item}>{item}</option>)}</select>
                    <button onClick={updateTicket} className="mt-5 w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">Save changes</button>
                    <h3 className="mt-8 font-semibold">Activity</h3>
                    <div className="mt-4 space-y-4">{activities.map((activity) => <div key={activity._id} className="border-l-2 border-brand-100 pl-3"><p className="text-sm font-semibold">{activity.action}</p><p className="mt-1 text-xs text-slate-500">{activity.details}</p><p className="mt-1 text-[11px] text-slate-400">{new Date(activity.createdAt).toLocaleString()}</p></div>)}</div>
                </aside>
            </div>
        </main>
    );
};

export default AdminTicketDetails;
