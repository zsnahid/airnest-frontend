"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Enum mappings matching the backend entities
const STATUS_MAP: Record<string | number, string> = {
  0: "Open",
  1: "In Progress",
  2: "Closed",
  3: "Cancelled",
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

const PRIORITY_MAP: Record<string | number, string> = {
  0: "Low",
  1: "Medium",
  2: "High",
  3: "Urgent",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const STATUS_COLORS = {
  Open: "#3b82f6", // blue-500
  "In Progress": "#f59e0b", // amber-500
  Closed: "#10b981", // emerald-500
  Cancelled: "#ef4444", // red-500
};

type Ticket = {
  id: number;
  status: string | number;
  priority: string | number;
  createdAt: string; // or Date, depending on serialization
  [key: string]: unknown;
};

export default function DashboardCharts({ tickets }: { tickets: Ticket[] }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        No ticket data available for visualization.
      </div>
    );
  }

  // --- Process Data for Charts ---

  // 1. Status Distribution
  const statusCounts = tickets.reduce(
    (acc, ticket) => {
      const statusLabel = STATUS_MAP[ticket.status] || "Unknown";
      acc[statusLabel] = (acc[statusLabel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  // 2. Priority Distribution
  const priorityCounts = tickets.reduce(
    (acc, ticket) => {
      const priorityLabel = PRIORITY_MAP[ticket.priority] || "Unknown";
      acc[priorityLabel] = (acc[priorityLabel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const priorityData = Object.keys(priorityCounts).map((key) => ({
    name: key,
    value: priorityCounts[key],
  }));

  // 3. Tickets Over Time (Daily - Last 7 days or all time sorted)
  // Group by date (YYYY-MM-DD)
  const ticketsByDate = tickets.reduce(
    (acc, ticket) => {
      const date = new Date(ticket.createdAt).toLocaleDateString("en-CA"); // YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort dates and take last 7-14 entries or all if small
  const sortedDates = Object.keys(ticketsByDate).sort();
  const timeData = sortedDates.map((date) => ({
    date,
    count: ticketsByDate[date],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Overview Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Total Tickets</div>
          <div className="stat-value">{tickets.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Open</div>
          <div className="stat-value text-primary">
            {statusCounts["Open"] || 0}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Closed</div>
          <div className="stat-value text-success">
            {statusCounts["Closed"] || 0}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Avg. Priority</div>
          <div className="stat-value text-secondary text-2xl">
            {/* Simple mode calculation or just top priority */}
            {priorityData.sort((a, b) => b.value - a.value)[0]?.name || "N/A"}
          </div>
        </div>
      </div>

      {/* Chart 1: Status Distribution (Pie) */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Ticket Status Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string;
                    percent?: number;
                  }) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[
                          entry.name as keyof typeof STATUS_COLORS
                        ] || "#8884d8"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 2: Priority Distribution (Bar) */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Tickets by Priority</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Trends (Line) */}
      <div className="card bg-base-100 shadow-xl lg:col-span-2">
        <div className="card-body">
          <h2 className="card-title">Daily Ticket Volume</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="New Tickets"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
