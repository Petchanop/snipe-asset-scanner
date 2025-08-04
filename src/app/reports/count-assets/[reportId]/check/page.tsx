import SearchAsset from "@/_components/tables/search-asset"
import { prisma } from "@/_libs/prisma"
import { getAssetCountLineByAssetCount } from "@/_libs/report.utils"
import Typography from "@mui/material/Typography"
import { GetAllUserPrisma } from "@/api/report.api"
import { notFound } from "next/navigation"
import { AssetCountWithAssetLocation } from "@/_types/interfaces"
import { getSession } from "auth"

export default async function CheckAssetPage(
    { params, searchParams }: { params :  Promise<{ reportId: string}>, searchParams: Promise<{ location?: number }> }, 
) {
    const { reportId } = await params
    const { location } = await searchParams
    const resolveLocationId = await location
    const documentNumber = await reportId
    const session = await getSession()
    //fetch data here
    //use mock data before implement api cal
    //fetch location from snipe api
    const assetCountReport = await prisma.asset_count.findUnique({
        where: {
            document_number: parseInt(documentNumber)
        },
        include: {
            AssetCountLocation: true
        }
    }) as AssetCountWithAssetLocation

    if (!assetCountReport)
        return notFound()

    const locationId = assetCountReport.AssetCountLocation.find((loc) => loc.location_id == resolveLocationId)
    const assetInReport = await getAssetCountLineByAssetCount(assetCountReport!.id!, locationId?.id as string)
    const users = await GetAllUserPrisma()
    return (
         <div className="p-4">
            <Typography>Check asset</Typography>
            {locationId && (
                <SearchAsset 
                    assetCountReport={assetCountReport!} 
                    assetInReport={assetInReport}
                    locationId={locationId}
                    users={users}
                    user={session.user}
                />
            )}
        </div>
    )
}