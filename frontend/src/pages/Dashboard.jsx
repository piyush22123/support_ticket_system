import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Ticket as TicketIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import TicketCard from "../components/TicketCard";

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("All");
    const [search, setSearch] = useState("");

    const getTickets = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/tickets", { params: { status, search } });
            setTickets(data.tickets);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTickets();
    }, [status, search]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-brand-600">YOUR SUPPORT SPACE</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">My tickets</h1>
                    <p className="mt-2 text-sm text-slate-500">Create a request and follow its progress.</p>
                </div>
                <Link to="/tickets/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">
                    <Plus size={18} /> Create ticket
                </Link>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search size={17} className="absolute left-3 top-3.5 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your tickets..." className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm" />
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
                    {["All", "Open", "In Progress", "Resolved", "Closed"].map((item) => <option key={item}>{item}</option>)}
                </select>
            </div>

            {loading ? (
                <p className="py-16 text-center text-sm text-slate-500">Loading tickets...</p>
            ) : tickets.length ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}
                </div>
            ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                    <TicketIcon className="mx-auto text-slate-300" size={38} />
                    <h2 className="mt-4 font-semibold text-slate-900">No tickets found</h2>
                    <p className="mt-1 text-sm text-slate-500">Your support requests will appear here.</p>
                    <Link to="/tickets/new" className="mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">Create your first ticket</Link>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
