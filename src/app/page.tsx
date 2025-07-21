'use server'
import { redirect } from "next/navigation";
// import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
// import { getChildrenLocation } from "@/_libs/location.utils";

export default async function Home() {
  // const locations = await fetchLocations();
  // const childrenLocation = getChildrenLocation(locations.data!.rows)
  // const locationDefaultId = childrenLocation[0]
  // console.log("redirect to default location", `/reports?loeation=${locationDefaultId?.id}`)
  // console.log("home page loading")
  redirect(`/reports`);
}
