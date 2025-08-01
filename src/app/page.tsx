'use server'
import { getSession } from "auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession()
  console.log("home page",session)
  if (session)
    redirect('/reports')
  redirect(`/auth/login`);
}
