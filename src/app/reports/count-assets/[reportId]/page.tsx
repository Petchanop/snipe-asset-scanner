import NewCountTable, { PNewCountTableProps } from "@/_components/tables/new-count-table";
import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
import { getParentLocation } from "@/_libs/location.utils";
import { TLocation } from "@/_types/snipe-it.type";
import { getLocationByIdSnipeIt } from "@/_apis/location.api";
import { GetAllUserPrisma, GetAssetCountLocationByAssetCountReport } from "@/_apis/report.api";
import { findAssetCount, getAssetCountReport, updateAssetCountReport } from "@/_libs/report.utils";
import { ReportState } from "@/_constants/constants";
import { notFound } from "next/navigation";
import { hasOwnProperty, Location } from "@/_types/types"

export default async function AssetsTablePage({ params }: {
    params: Promise<{ reportId: string }>
}
) {
    const { reportId } = await params
    // if (!resolveLocationId)
    //     notFound()
    //fetch data here
    //use mock data before implement api call
    //fetch location from snipe api
    const assetCountReport = await getAssetCountReport(parseInt(reportId))
    if (!assetCountReport)
        notFound()
    const locationId = await GetAssetCountLocationByAssetCountReport(assetCountReport.id)
    const locations = await fetchLocations();
    const parentLocation = getParentLocation(locations.data!.rows)
    // const childrenLocation = getChildrenLocation(locations.data!.rows) as TLocation[]
    // const otherLocation = getOtherLocation(locations.data!.rows)
    const locationData: Location[] = []
    const listOfParent: Location[] = []
    for (const loc of locationId) {
        const { data, error } = await getLocationByIdSnipeIt(loc.location_id)
        if (error) {
            return notFound()
        }
        if (hasOwnProperty(data.parent!, 'id')) {
            //@ts-expect-error some use parent_id some parent.id
            const filterParent = parentLocation.find((parent) => parent.id == data.parent.id as unknown as number)
            if (!listOfParent.includes(filterParent as unknown as Location)) {
                listOfParent.push(filterParent as unknown as Location)
                locationData.push(data as unknown as Location)
            }
            else if (filterParent != null ){
                locationData.push(data as unknown as Location)
            } else {
                listOfParent.push(data as unknown as Location)
            }
        } else {
            locationData.push(data as unknown as Location)
            listOfParent.push(data as unknown as Location)
        }
    }
    const users = await GetAllUserPrisma()
    let report = await findAssetCount(reportId ? parseInt(reportId) : 0)
    if (report?.state === ReportState.NEW) {
        report.state = ReportState.INPROGRESS
        report = await updateAssetCountReport(
            report.document_number, report)
    }
    const parent = parentLocation.find((loc) => (
        loc.children as unknown as { id: number, name: string }[])
        .find((child: { id: number, name: string }) => locationId.find((loc) => child.id == loc.location_id))
    ) as TLocation

    return (
        <NewCountTable
            // parentLocation={parentLocation.filter((loc) => loc.id == parent.id)}
            parentLocation={listOfParent as unknown as TLocation[]}
            childrenLocation={locationData as unknown as TLocation[]}
            locations={locationData as PNewCountTableProps[]}
            defaultLocation={locationData[0] as unknown as TLocation}
            locationId={locationData[0]?.id as number}
            parentProp={parent}
            users={users}
            report={report}
        />
    )
}