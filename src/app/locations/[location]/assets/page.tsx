import NewCountTable from "@/_components/tables/new-count-table";
import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
import { getChildrenLocation } from "@/_libs/location.utils";
import { TLocation } from "@/_types/snipe-it.type";
import { getLocationById } from "@/_apis/location.api";

export default async function AssetsTablePage({ params }: { params: { location: Promise<string> } }) {
    const { location } = await params
    const locationId = await location
    console.log("location id : ", location)
    //fetch data here
    //use mock data before implement api call
    //fetch location from snipe api
    const locations = await fetchLocations();
    const resolveLocationId = await location
    const childrenLocation = getChildrenLocation(locations.data!.rows) as TLocation[]
    const locationData = await getLocationById(parseInt(resolveLocationId))
    let filterByParentId = null
    if (!locationData?.parent_id) {
        filterByParentId = childrenLocation
            // @ts-expect-error cause it not wrong type the object has => id in parent properties
            .filter((loc) => loc.parent!.id == Number(resolveLocationId))
            .map((loc) => ({
                name: loc.name as unknown as string,
                id: loc.id as unknown as number
            }))
    } else {
          filterByParentId = childrenLocation
            // @ts-expect-error cause it not wrong type the object has => id in parent properties
            .filter((loc) => loc.parent!.id == Number(locationData?.parent_id))
            .map((loc) => ({
                name: loc.name as unknown as string,
                id: loc.id as unknown as number
            }))
    }
    return (
        <NewCountTable 
            locations={filterByParentId} 
            defaultLocation={locationData?.name!}
            locationId={parseInt(locationId)}
        />
    )
}