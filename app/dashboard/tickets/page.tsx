import { getTickets } from "@/lib/dashboard_actions";

type Ticket = {
  id: number;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default async function Tickets() {
  const tickets = await getTickets();
  console.log(tickets);

  const getPriorityBadge = (priority: string) => {
    const badges = {
      HIGH: "badge-error",
      MEDIUM: "badge-warning",
      LOW: "badge-info",
    };
    return badges[priority as keyof typeof badges] || "badge-neutral";
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      OPEN: "badge-info",
      IN_PROGRESS: "badge-warning",
      CLOSED: "badge-success",
    };
    return badges[status as keyof typeof badges] || "badge-neutral";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Support Tickets</h2>
        <p className="text-base-content/60 mt-2">
          Manage and track your support tickets
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="w-16">#</th>
              <th>Subject</th>
              <th>Description</th>
              <th className="w-32">Priority</th>
              <th className="w-32">Status</th>
              <th className="w-40">Created</th>
              <th className="w-40">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets && tickets.length > 0 ? (
              tickets.map((ticket: Ticket, index: number) => (
                <tr key={ticket.id} className="hover">
                  <th>{index + 1}</th>
                  <td className="font-semibold">{ticket.subject}</td>
                  <td>
                    <div
                      className="max-w-md truncate"
                      title={ticket.description}
                    >
                      {ticket.description}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-xs badge-soft ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="text-sm">{formatDate(ticket.createdAt)}</td>
                  <td className="text-sm">{formatDate(ticket.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-base-content/60"
                >
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
