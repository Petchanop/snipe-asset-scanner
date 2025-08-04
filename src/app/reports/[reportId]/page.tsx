import AssetReport from '@/_components/assetReport'
import { getAssetCountLineByAssetCount, getAssetCountReport } from '@/_libs/report.utils'
import { AssetCountWithLineAndLocation } from '@/_types/interfaces'
import { AssetCountLine, User } from '@/_types/types'
import { GetAllUserPrisma } from '@/api/report.api'
import { fetchLocations } from '@/api/snipe-it/snipe-it.api'
import { getSession } from 'auth'
import { notFound, redirect } from 'next/navigation'

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
    const { reportId } = await params
    const session = await getSession()
    if (!session)
        return redirect('/auth/unauthorized')
    if (!reportId)
        return notFound()
    const reportIdNumber = Number(reportId)
    const assetCountReport = await getAssetCountReport(reportIdNumber, true) as AssetCountWithLineAndLocation
    const allAssetCountLine: AssetCountLine[] = []
    const locations = await fetchLocations();
    const locationsProp = []
    for (let j = 0; j < assetCountReport.AssetCountLocation.length; j++) {
        const location = assetCountReport.AssetCountLocation[j]
        const assetCountLine= await getAssetCountLineByAssetCount(assetCountReport.id, location!.id)
        allAssetCountLine.push(...assetCountLine)
        const assetLocation = locations.data?.rows.find((loc) => loc.id == location?.location_id) 
        const assetLocationObj = {
            ...assetLocation,
            loc_id: location?.id as string
        }
        locationsProp.push(assetLocationObj!)
    }
    const users = await GetAllUserPrisma()
    let user = users.find((user) => user.id == assetCountReport.created_by) as User
    if (!user) {
        user = {
            first_name: session.user.firstName,
            last_name: session.user.LastName
        } as User
    }
    return (
        <AssetReport
            assetCountReport={assetCountReport}
            locations={locationsProp as any}
            assetCountLine={allAssetCountLine}
            user={user}
            listOfUser={users}
        />
    )
}