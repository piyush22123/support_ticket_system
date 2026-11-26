import TicketForm from "../components/TicketForm";

const CreateTicket = () => (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold text-brand-600">NEW REQUEST</p>
        <h1 className="mt-2 text-3xl font-bold">Create a support ticket</h1>
        <p className="mb-7 mt-2 text-sm text-slate-500">Share the details of the issue so our support team can help.</p>
        <TicketForm />
    </main>
);

export default CreateTicket;
