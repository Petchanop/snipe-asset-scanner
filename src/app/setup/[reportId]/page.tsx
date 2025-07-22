import { GetAssetCountLocationByAssetCountReport } from "@/_apis/report.api"
import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api"
import SetupPlanComponent from "@/_components/setUpPlanComponent"
import { ReportState } from "@/_constants/constants"
import { getChildrenLocation, getOtherLocation, getParentLocation } from "@/_libs/location.utils"
import { getAssetCountReport } from "@/_libs/report.utils"
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
    // const otherLocation = getOtherLocation(locations.data!.rows)
    // const childProp = typeof location !== 'undefined' ? childrenLocation.find((loc) => loc.id == location) : childrenLocation[0]
    const parentProp = parentLocation[0] as TLocation
    console.log(report)
    return <>
        <SetupPlanComponent
            assetCountLocation={assetCountLocation}
            assetCountReport={report as AssetCount & { asset_count_location:  AssetCountLocation[] }}
            parentLocation={parentLocation}
            childrenLocation={childrenLocation}
            parentProp={parentProp}
        />
    </>
}