"use client";

import { getTickets } from "@/lib/dashboard_actions";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const statuses = ["OPEN", "IN_PROGRESS", "CLOSED", "CANCELLED"];
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    getTickets(selectedStatus, selectedPriority).then(setTickets);

    const statusPopover = document.getElementById("status-popover");
    const handleStatusToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      setIsStatusOpen(toggleEvent.newState === "open");
    };

    const priorityPopover = document.getElementById("priority-popover");
    const handlePriorityToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      setIsPriorityOpen(toggleEvent.newState === "open");
    };

    statusPopover?.addEventListener("toggle", handleStatusToggle);
    priorityPopover?.addEventListener("toggle", handlePriorityToggle);

    return () => {
      statusPopover?.removeEventListener("toggle", handleStatusToggle);
      priorityPopover?.removeEventListener("toggle", handlePriorityToggle);
    };
  }, [selectedStatus, selectedPriority]);

  const handleStatusFilter = (status: string | undefined) => {
    setSelectedStatus(status);
    const popover = document.getElementById("status-popover");
    popover?.hidePopover();
  };

  const handlePriorityFilter = (priority: string | undefined) => {
    setSelectedPriority(priority);
    const popover = document.getElementById("priority-popover");
    popover?.hidePopover();
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      URGENT: "badge-error",
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
      CANCELLED: "badge-neutral",
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

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="w-16">#</th>
              <th>Subject</th>
              <th>Description</th>
              <th className="w-32">
                <button
                  className="btn btn-ghost p-0"
                  popoverTarget="priority-popover"
                  style={{ anchorName: "--priority-anchor" }}
                >
                  Priority
                  <ChevronDown
                    className={`transition-transform duration-200 ${
                      isPriorityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <ul
                  popover="auto"
                  id="priority-popover"
                  style={{ positionAnchor: "--priority-anchor" }}
                  className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm mt-1"
                >
                  <li>
                    <button onClick={() => handlePriorityFilter(undefined)}>
                      ALL
                    </button>
                  </li>
                  {priorities.map((priority) => (
                    <li key={priority}>
                      <button onClick={() => handlePriorityFilter(priority)}>
                        {priority}
                      </button>
                    </li>
                  ))}
                </ul>
              </th>
              <th className="w-36">
                <button
                  className="btn btn-ghost p-0"
                  popoverTarget="status-popover"
                  style={{ anchorName: "--status-anchor" }}
                >
                  Status
                  <ChevronDown
                    className={`transition-transform duration-200 ${
                      isStatusOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <ul
                  popover="auto"
                  id="status-popover"
                  style={{ positionAnchor: "--status-anchor" }}
                  className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm mt-1"
                >
                  <li>
                    <button onClick={() => handleStatusFilter(undefined)}>
                      ALL
                    </button>
                  </li>
                  {statuses.map((status) => (
                    <li key={status}>
                      <button onClick={() => handleStatusFilter(status)}>
                        {status.replace("_", " ")}
                      </button>
                    </li>
                  ))}
                </ul>
              </th>
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
                      className={`badge badge-sm badge-soft ${getStatusBadge(
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
