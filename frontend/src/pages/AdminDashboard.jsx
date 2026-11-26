import { useEffect, useState } from "react";
import { Search, Users, Ticket, CircleDot, Clock3, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import TicketCard from "../components/TicketCard";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        try {
            const [statsResponse, ticketResponse] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/tickets", { params: { status, priority, search, limit: 50 } })
            ]);
            setStats(statsResponse.data.stats);
            setTickets(ticketResponse.data.tickets);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load admin dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [status, priority, search]);

    const cards = stats ? [
        { label: "Total tickets", value: stats.total, icon: Ticket, color: "bg-blue-50 text-blue-600" },
        { label: "Open", value: stats.open, icon: CircleDot, color: "bg-sky-50 text-sky-600" },
        { label: "In progress", value: stats.inProgress, icon: Clock3, color: "bg-amber-50 text-amber-600" },
        { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
        { label: "Registered users", value: stats.users, icon: Users, color: "bg-violet-50 text-violet-600" }
    ] : [];

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <p className="text-sm font-semibold text-brand-600">ADMINISTRATION</p>
            <h1 className="mt-2 text-3xl font-bold">Support dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Review incoming requests and keep the support queue moving.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className={`inline-flex rounded-lg p-2 ${card.color}`}><Icon size={19} /></div>
                            <p className="mt-4 text-2xl font-bold">{card.value}</p>
                            <p className="mt-1 text-xs text-slate-500">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-xl font-bold">All support tickets</h2>
                    <p className="mt-1 text-sm text-slate-500">Filter, open and update submitted tickets.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm sm:w-44" />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm">
                        {["All", "Open", "In Progress", "Resolved", "Closed"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm">
                        {["All", "Low", "Medium", "High", "Urgent"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                </div>
            </div>

            {loading ? <p className="py-16 text-center text-sm text-slate-500">Loading tickets...</p> :
                tickets.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} showOwner />)}</div> :
                <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No tickets match these filters.</p>}
        </main>
    );
};

export default AdminDashboard;
