import { GetAssetCountLocationByAssetCountReport } from "@/_apis/report.api"
import SetupPlanComponent from "@/_components/setUpPlanComponent"
import { ReportState } from "@/_constants/constants"
import { getAssetCountReport } from "@/_libs/report.utils"
import { AssetCount } from "@/_types/types"

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
    return <>
        <SetupPlanComponent
            assetCountLocation={assetCountLocation}
            assetCountReport={report}
        />
    </>
}