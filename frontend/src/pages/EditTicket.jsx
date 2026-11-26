import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import TicketForm from "../components/TicketForm";

const EditTicket = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        api.get(`/tickets/${id}`)
            .then(({ data }) => setTicket(data.ticket))
            .catch((error) => toast.error(error.response?.data?.message || "Unable to load ticket"));
    }, [id]);

    return (
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <h1 className="mb-2 text-3xl font-bold">Edit ticket</h1>
            <p className="mb-7 text-sm text-slate-500">Update the details of your support request.</p>
            {ticket ? <TicketForm ticket={ticket} /> : <p className="text-sm text-slate-500">Loading ticket...</p>}
        </main>
    );
};

export default EditTicket;
