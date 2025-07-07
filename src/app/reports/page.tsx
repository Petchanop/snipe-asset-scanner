'use server'
import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api"
import LocationTable from "@/_components/tables/location-table"
import { getChildrenLocation, getParentFromChildId, getParentLocation } from '../_libs/location.utils';
import { TLocation } from "@/_types/snipe-it.type";

export default async function ReportTablePage( { searchParams } : {
    searchParams: Promise<{location?: number}>
}) {
    const { location } = await searchParams
    const locations = await fetchLocations();
    const parentLocation = getParentLocation(locations.data!.rows)
    const childrenLocation = getChildrenLocation(locations.data!.rows)
    let parentProp = null
    let childProp = location ? childrenLocation.find((loc) => loc.id == location) : childrenLocation[0]
    if (location)
        parentProp = getParentFromChildId(childrenLocation, parseInt(location?.toString())) as TLocation
    else 
        parentProp = parentLocation[0]
    return (
        <LocationTable 
            parentLocation={parentLocation} 
            childrenLocation={childrenLocation}
            parentProp={parentProp!}
            childProp={childProp!}
        />
    )
}