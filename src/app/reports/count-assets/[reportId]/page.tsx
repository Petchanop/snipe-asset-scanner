import NewCountTable, { PNewCountTableProps } from "@/_components/tables/new-count-table";
import { fetchLocations } from "@/_intergrations/snipeit/locations";
import { getParentLocation } from "@/_libs/location";
import { TLocation } from "@/_types/snipe-it.type";
import { getLocationByIdSnipeIt } from "@/api/location.api";
import { GetAllUserPrisma } from "@/_repositories/user"
import { GetAssetCountLocationByAssetCountReport } from "@/_repositories/assetCountLocation";
import { findAssetCount, getAssetCountReport, updateAssetCountReport } from "@/_repositories/assetCount";
import { ReportState } from "@/_constants/constants";
import { notFound } from "next/navigation";
import { hasOwnProperty, Location } from "@/_types/types"
import { getSession } from "auth";

export default async function AssetsTablePage({
    params,
    searchParams,
}: {
    params: Promise<{ reportId: string }>;
    searchParams: Promise<{ location: number }>;
}) {
    const { reportId } = await params;
    const { location } = await searchParams;
    const session = await getSession()
    const assetCountReport = await getAssetCountReport(parseInt(reportId))
    if (!assetCountReport)
        notFound()
    if (assetCountReport.state == ReportState.COMPLETED)
        return (
            <>
                This report have been finished.
            </>
        )
    const locationIds = await GetAssetCountLocationByAssetCountReport(assetCountReport.id)
    const locations = await fetchLocations();
    const parentLocation = getParentLocation(locations.data!.rows)
    const locationData: Location[] = []
    const listOfParent: Location[] = []
    for (const loc of locationIds) {
        const { data, error } = await getLocationByIdSnipeIt(loc.location_id)
        if (data?.status === 'error' || error) {
            return notFound()
        }
        if (hasOwnProperty(data?.parent!, 'id')) {
            //@ts-expect-error some use parent_id some parent.id
            const filterParent = parentLocation.find((parent) => parent.id == data.parent.id as unknown as number)
            if (!listOfParent.includes(filterParent as unknown as Location)) {
                listOfParent.push(filterParent as unknown as Location)
                locationData.push(data as unknown as Location)
            }
            else if (filterParent != null) {
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
        .find((child: { id: number, name: string }) => locationIds.find((loc) => child.id == loc.location_id))
    ) as TLocation
    const baseUrl = process.env.SNIPE_URL
    const defaultLocation = location ?
        locationData.find((loc) => loc.id == location)
        : locationData![0] as unknown as TLocation
    return (
        <>
            <NewCountTable
                allLocation={locations.data!.rows}
                parentLocation={listOfParent as unknown as TLocation[]}
                childrenLocation={locationData as unknown as TLocation[]}
                locations={locationData as PNewCountTableProps[]}
                defaultLocation={defaultLocation as unknown as TLocation}
                locationId={defaultLocation?.id as number}
                assetCountLocation={locationIds}
                parentProp={parent}
                users={users}
                report={report}
                user={session?.user}
                baseUrl={baseUrl as string}
            />

        </>
    )
}