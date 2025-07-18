import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
import LocationTable from "@/_components/tables/location-table";
import { getChildrenLocation, getOtherLocation, getParentFromChildId, getParentLocation } from "@/_libs/location.utils";
import { TLocation } from "@/_types/snipe-it.type";

export default async function ReportListPage({ params }: {
    params: Promise<{ locationId: number }>
}) {
    const location = await params
    const locationId = location.locationId
    
    const locations = await fetchLocations();
    let parentLocation = getParentLocation(locations.data!.rows)
    const childrenLocation = getChildrenLocation(locations.data!.rows)
    const otherLocation = getOtherLocation(locations.data!.rows)
    parentLocation = [...parentLocation, ...otherLocation]
    let parentProp = null
    const childProp = typeof location !== 'undefined' ? childrenLocation.find((loc) => loc.id == location) : childrenLocation[0]
    if (locationId) {
        parentProp = getParentFromChildId(childrenLocation, locationId!) as TLocation
        if (typeof parentProp == 'undefined') {
            parentProp = locations.data!.rows.find((loc) => loc.id == locationId)
        }
    }
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