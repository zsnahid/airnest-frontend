"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function getTickets() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/support/tickets",
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );
  const data = response.data;
  return data;
}
