"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function getTickets(status?: string, priority?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (priority) params.append("priority", priority);

  const url = `${
    process.env.NEXT_PUBLIC_API_ENDPOINT
  }/support/tickets?${params.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.data;
  return data;
}
