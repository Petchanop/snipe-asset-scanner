import SearchAsset from "@/_components/tables/search-asset"
import { prisma } from "@/_libs/prisma"
import { getAssetCountLineByAssetCount } from "@/_libs/report.utils"
import { AssetCount } from "@/_types/types"
import Typography from "@mui/material/Typography"
import { GetAllUserPrisma, GetAssetCountLocationByAssetCountReport } from "@/_apis/report.api"

export default async function CheckAssetPage(
    { params, searchParams }: { params :  Promise<{ reportId: string}>, searchParams: Promise<{ location?: number }> }, 
) {
    const { reportId } = await params
    const { location } = await searchParams
    const resolveLocationId = await location
    const  documentNumber = await reportId
    //fetch data here
    //use mock data before implement api cal
    //fetch location from snipe api
    const assetCountReport : AssetCount | null = await prisma.asset_count.findUnique( {
        where: {
            document_number : parseInt(documentNumber)
        },
        include : {
            AssetCountLocation: true
        }
    })
    const locationIds = await GetAssetCountLocationByAssetCountReport(assetCountReport!.id)
    const locationId = locationIds.find((loc) => loc.location_id == resolveLocationId)
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
                />
            )}
        </div>
    )
}