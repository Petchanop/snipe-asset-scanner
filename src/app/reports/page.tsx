'use server'
import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api"
import LocationTable from "@/_components/tables/location-table"
import { getChildrenLocation, getParentLocation } from '../_libs/location.utils';

export default async function ReportTablePage() {
    const locations = await fetchLocations();
    const parentLocation = getParentLocation(locations.data!.rows)
    const childrenLocation = getChildrenLocation(locations.data!.rows)
    
    return (
        <LocationTable  parentLocation={parentLocation} childrenLocation={childrenLocation}/>
    )
}