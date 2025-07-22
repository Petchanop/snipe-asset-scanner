'use server'
import { redirect } from "next/navigation";
// import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
// import { getChildrenLocation } from "@/_libs/location.utils";

export default async function Home() {
  redirect(`/reports`);
}
