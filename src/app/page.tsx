'use server'
import { getSession } from "auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession()
  if (session)
    redirect('/reports')
  redirect(`/auth/login`);
}
