import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

const TicketCard = ({ ticket, showOwner = false }) => (
    <Link to={showOwner ? `/admin/tickets/${ticket._id}` : `/tickets/${ticket._id}`} className="group block rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {ticket.category} · #{ticket._id.slice(-6).toUpperCase()}
                </p>
                <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-brand-600">{ticket.title}</h3>
            </div>
            <StatusBadge value={ticket.status} />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{ticket.description}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3 text-xs text-slate-500">
                <StatusBadge value={ticket.priority} />
                {showOwner && <span>{ticket.createdBy?.name || "User"}</span>}
                <span className="flex items-center gap-1"><CalendarDays size={13} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-brand-600" />
        </div>
    </Link>
);

export default TicketCard;
