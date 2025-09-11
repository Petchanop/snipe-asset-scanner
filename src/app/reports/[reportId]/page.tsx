import AssetReport from '@/reports/[reportId]/assetReport'
import { getAssetCountLineByAssetCount } from "@/_repositories/assetCountLine"
import { getAssetCountReport } from '@/_repositories/assetCount'
import { AssetCountWithLineAndLocation } from '@/_types/interfaces'
import { AssetCountLine, User } from '@/_types/types'
import { GetAllUserPrisma } from '@/_repositories/user'
import { fetchLocations } from '@/_intergrations/snipeit/locations'
import { getSession } from 'auth'
import { notFound, redirect } from 'next/navigation'
import { AssetStatusEnum } from '@/_constants/constants'

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
    const { reportId } = await params
    const session = await getSession()
    if (!session)
        return redirect('/auth/unauthorized')
    const reportIdNumber = Number(reportId)
    const assetCountReport = await getAssetCountReport(reportIdNumber, true) as AssetCountWithLineAndLocation
    if (!reportId || !assetCountReport)
        return notFound()
    const allAssetCountLine: AssetCountLine[] = []
    const locations = await fetchLocations();
    const locationsProp = []
    let assetNotCheck = 0
    let assetMalFunction = 0
    let assetAdditional = 0
    let assetAssignedIncorrect = 0
    for (let j = 0; j < assetCountReport.AssetCountLocation.length; j++) {
        const location = assetCountReport.AssetCountLocation[j]
        const assetCountLine = await getAssetCountLineByAssetCount(assetCountReport.id, location!.id)
        allAssetCountLine.push(...assetCountLine)
        const assetLocation = locations.data?.rows.find((loc) => loc.id == location?.location_id)
        const assetLocationObj = {
            ...assetLocation,
            loc_id: location?.id as string
        }
        locationsProp.push(assetLocationObj!)
        for (const countLine of assetCountLine) {
            if (!countLine.asset_check && !countLine.is_not_asset_loc)
                assetNotCheck++
            if (countLine.is_not_asset_loc)
                assetAdditional++
            if (countLine.asset_count_line_status_id == AssetStatusEnum.MALFUNCTIONING && !countLine.is_not_asset_loc)
                assetMalFunction++
            if (countLine.is_assigned_incorrectly)
                assetAssignedIncorrect++
        }
    }
    const users = await GetAllUserPrisma()
    let user = users.find((user) => user.id == assetCountReport.created_by) as User
    if (!user) {
        user = {
            first_name: session.user.firstName,
            last_name: session.user.LastName
        } as User
    }

    const reportData = {
        assetNotCheck : assetNotCheck,
        assetAdditional: assetAdditional,
        assetAssignedIncorrect: assetAssignedIncorrect,
        assetMalFunction: assetMalFunction
    }
    return (
        <AssetReport
            assetCountReport={assetCountReport}
            locations={locationsProp as any}
            assetCountLine={allAssetCountLine.sort((a, b) => b.assigned_to! - a.assigned_to!)}
            user={user}
            listOfUser={users}
            reportData={reportData}
        />
    )
}