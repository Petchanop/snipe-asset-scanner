import NewCountTable from "@/_components/tables/new-count-table";
import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
import { getChildrenLocation } from "@/_libs/location.utils";
import { TLocation } from "@/_types/snipe-it.type";
import { getLocationById } from "@/_apis/location.api";

export default async function AssetsTablePage({ params }: { params: { location: Promise<string> } }) {
    const { location } = await params
    const locationId = await location
    console.log("start count page" , locationId)
    //fetch data here
    //use mock data before implement api call
    //fetch location from snipe api
    return (
        <>Start count page</>
    )
}