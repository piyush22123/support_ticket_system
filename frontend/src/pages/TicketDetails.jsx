import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const getTicket = async () => {
        try {
            const { data } = await api.get(`/tickets/${id}`);
            setTicket(data.ticket);
            setComments(data.comments);
            setActivities(data.activities);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load ticket");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTicket();
    }, [id]);

    const addComment = async (event) => {
        event.preventDefault();
        if (!message.trim()) return;
        try {
            const { data } = await api.post(`/tickets/${id}/comments`, { message });
            setComments([...comments, data.comment]);
            setMessage("");
            toast.success("Comment added");
            getTicket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to add comment");
        }
    };

    const deleteTicket = async () => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;
        try {
            await api.delete(`/tickets/${id}`);
            toast.success("Ticket deleted");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to delete ticket");
        }
    };

    if (loading) return <p className="p-12 text-center text-slate-500">Loading ticket...</p>;
    if (!ticket) return null;

    const isOwner = ticket.createdBy?._id === user.id || ticket.createdBy === user.id;

    return (
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600"><ArrowLeft size={16} /> Back to tickets</Link>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
                <section className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{ticket.category} · #{ticket._id.slice(-6).toUpperCase()}</p>
                            <StatusBadge value={ticket.status} />
                        </div>
                        <h1 className="mt-3 text-2xl font-bold">{ticket.title}</h1>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{ticket.description}</p>
                        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
                            <span>Submitted by <b className="text-slate-700">{ticket.createdBy?.name}</b></span>
                            <span>·</span>
                            <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                            <StatusBadge value={ticket.priority} />
                        </div>
                        {isOwner && ticket.status === "Open" && (
                            <div className="mt-5 flex gap-3">
                                <Link to={`/tickets/${id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"><Pencil size={15} /> Edit</Link>
                                <button onClick={deleteTicket} className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600"><Trash2 size={15} /> Delete</button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-bold">Conversation <span className="ml-1 text-sm font-normal text-slate-400">({comments.length})</span></h2>
                        <div className="mt-5 space-y-4">
                            {comments.length ? comments.map((comment) => (
                                <div key={comment._id} className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <p className="text-sm font-semibold">{comment.user?.name} <span className="ml-1 rounded bg-white px-2 py-0.5 text-[10px] uppercase text-slate-500">{comment.user?.role}</span></p>
                                        <p className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{comment.message}</p>
                                </div>
                            )) : <p className="text-sm text-slate-500">No comments yet. Start the conversation below.</p>}
                        </div>
                        <form onSubmit={addComment} className="mt-6">
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={2000} placeholder="Write a reply..." className="w-full rounded-lg border border-slate-200 p-3 text-sm" />
                            <div className="mt-3 flex justify-end">
                                <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"><Send size={15} /> Add comment</button>
                            </div>
                        </form>
                    </div>
                </section>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="font-bold">Activity history</h2>
                    <div className="mt-5 space-y-5">
                        {activities.map((activity) => (
                            <div key={activity._id} className="border-l-2 border-brand-100 pl-3">
                                <p className="text-sm font-semibold">{activity.action}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{activity.details}</p>
                                <p className="mt-1 text-[11px] text-slate-400">{new Date(activity.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                        {!activities.length && <p className="text-sm text-slate-500">No activity yet.</p>}
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default TicketDetails;
