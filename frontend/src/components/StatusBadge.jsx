const styles = {
    "Open": "bg-blue-50 text-blue-700",
    "In Progress": "bg-amber-50 text-amber-700",
    "Resolved": "bg-emerald-50 text-emerald-700",
    "Closed": "bg-slate-100 text-slate-600",
    "Low": "bg-slate-100 text-slate-600",
    "Medium": "bg-blue-50 text-blue-700",
    "High": "bg-orange-50 text-orange-700",
    "Urgent": "bg-red-50 text-red-700"
};

const StatusBadge = ({ value }) => (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || "bg-slate-100 text-slate-600"}`}>
        {value}
    </span>
);

export default StatusBadge;
