import { getTickets } from "@/lib/dashboard_actions";
import DashboardCharts from "@/components/dashboard-charts";

export default async function Dashboard() {
  let tickets = [];
  try {
    tickets = await getTickets();
  } catch (error) {
    console.error("Failed to fetch tickets for dashboard:", error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <DashboardCharts tickets={Array.isArray(tickets) ? tickets : []} />
    </div>
  );
}
