import { getUserFromToken, logoutUser } from "@/lib/auth_actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Sidebar() {
  const user = await getUserFromToken();

  async function handleLogout() {
    "use server";
    await logoutUser();
    redirect("/login");
  }

  return (
    <div className="bg-gray-100 border-r border-r-gray-300 p-4 h-screen w-64">
      {user && (
        <div className="mb-6 pb-4 border-b border-gray-300">
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-sm text-gray-600">{user.role}</div>
        </div>
      )}

      <nav className="flex flex-col space-y-2">
        <Link
          href="/dashboard"
          className="px-2 py-1 hover:bg-gray-200 rounded-md"
        >
          Home
        </Link>
        <Link
          href="/dashboard/tickets"
          className="px-2 py-1 hover:bg-gray-200 rounded-md"
        >
          Tickets
        </Link>

        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full text-left px-2 py-1 hover:bg-gray-200 rounded-md text-red-600"
          >
            Logout
          </button>
        </form>
      </nav>
    </div>
  );
}
