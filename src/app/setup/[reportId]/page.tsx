import { GetAssetCountLocationByAssetCountReport } from "@/_repositories/assetCountLocation"
import { fetchLocations } from "@/_intergrations/snipeit/locations"
import SetupPlanComponent from "@/setup/[reportId]/setUpPlanComponent"
import { ReportState } from "@/_constants/constants"
import { getChildrenLocation, getOtherLocation, getParentLocation } from "@/_libs/location"
import { getAssetCountReport } from "@/_repositories/assetCount"
import { TLocation } from "@/_types/snipe-it.type"
import { AssetCount, AssetCountLocation } from "@/_types/types"

export default async function SetUpPage(
    { params }: { params: Promise<{ reportId: string }> }
) {
    const { reportId } = await params
    const report = await getAssetCountReport(parseInt(reportId)) as AssetCount
    if (report.state != ReportState.NEW) {
        return (
            <>
                This report cannot edit.
            </>
        )
    }
    const assetCountLocation = await GetAssetCountLocationByAssetCountReport(report.id)
    const locations = await fetchLocations();
    let parentLocation = getParentLocation(locations.data!.rows)
    const childrenLocation = getChildrenLocation(locations.data!.rows)
    const otherLocation = getOtherLocation(locations.data!.rows)
    const parentProp = parentLocation[0] as TLocation
    parentLocation = [...parentLocation, ...otherLocation ]
    return <>
        <SetupPlanComponent
            assetCountLocation={assetCountLocation}
            assetCountReport={report as AssetCount & { AssetCountLocation:  AssetCountLocation[] }}
            parentLocation={parentLocation}
            childrenLocation={childrenLocation}
            otherLocation={otherLocation}
            parentProp={parentProp}
        />
    </>
}