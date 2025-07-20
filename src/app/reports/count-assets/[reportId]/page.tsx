import NewCountTable, { PNewCountTableProps } from "@/_components/tables/new-count-table";
import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
import { getChildrenLocation, getParentLocation } from "@/_libs/location.utils";
import { TLocation } from "@/_types/snipe-it.type";
import { getLocationById } from "@/_apis/location.api";
import { GetAllUserPrisma } from "@/_apis/report.api";
import { findAssetCount, updateAssetCountReport } from "@/_libs/report.utils";
import { ReportState } from "@/_constants/constants";

export default async function AssetsTablePage({ searchParams, params } : {
    searchParams: Promise<{ location?: number }>, params: Promise<{ reportId: string }> } 
) {
    const { location } = await searchParams
    const { reportId } = await params
    const resolveLocationId = await location
    // if (!resolveLocationId)
    //     notFound()
    //fetch data here
    //use mock data before implement api call
    //fetch location from snipe api
    const locations = await fetchLocations();
    const parentLocation = getParentLocation(locations.data!.rows)
    const childrenLocation = getChildrenLocation(locations.data!.rows) as TLocation[]
    // const otherLocation = getOtherLocation(locations.data!.rows)
    const locationData = await getLocationById(parseInt(resolveLocationId?.toString()!))
    const users = await GetAllUserPrisma()
    let report = await findAssetCount(reportId ? parseInt(reportId) : 0)
    if (report?.state === ReportState.NEW) {
        report.state = ReportState.INPROGRESS
        report = await updateAssetCountReport(
            report.document_number, report)
    }
    const parent = parentLocation.find((loc) => (
        loc.children as unknown as {id:number, name: string} [])
        .find((child: { id: number, name: string}) => child.id == resolveLocationId)
    ) as TLocation
    let filterByParentId = null
    if (!locationData?.parent_id) {
        filterByParentId = childrenLocation
            // @ts-expect-error cause it not wrong type the object has => id in parent properties
            .filter((loc) => loc.parent!.id == Number(resolveLocationId))
            .map((loc) => ({
                name: loc.name as unknown as string,
                id: loc.id as unknown as number,
                rtd_location_id: Number(resolveLocationId)
            }))
    } else {
        filterByParentId = childrenLocation
            // @ts-expect-error cause it not wrong type the object has => id in parent properties
            .filter((loc) => loc.parent!.id == Number(locationData?.parent_id))
            .map((loc) => ({
                name: loc.name as unknown as string,
                id: loc.id as unknown as number,
                rtd_location_id: locationData?.parent_id
            }))
    }
    return (
        <NewCountTable 
            parentLocation={parentLocation}
            childrenLocation={childrenLocation}
            locations={filterByParentId as unknown as PNewCountTableProps[]} 
            defaultLocation={locationData as unknown as TLocation} 
            locationId={parseInt(resolveLocationId!.toString())}
            parentProp={parent}
            users={users}
            report={report}
        />
    )
}