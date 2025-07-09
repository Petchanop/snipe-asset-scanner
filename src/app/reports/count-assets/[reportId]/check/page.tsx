import SearchAsset from "@/_components/tables/search-asset"
import { prisma } from "@/_libs/prisma"
import { AssetCount } from "@/_types/types"
import Typography from "@mui/material/Typography"

export default async function CheckAssetPage(
    { searchParams, params }: { searchParams: Promise<{location: string}>, params :  Promise<{ reportId: string}> }, 
) {
    const { location } = await searchParams
    const { reportId } = await params
    const locationId = await location
    const  documentNumber = await reportId
    //fetch data here
    //use mock data before implement api cal
    //fetch location from snipe api
    const assetCountReport : AssetCount | null = await prisma.asset_count.findUnique( {
        where: {
            document_number : documentNumber
        }
    })
    console.log("start count page" , locationId, location, assetCountReport)
    return (
         <div className="p-4">
            <Typography>Check asset</Typography>
            <SearchAsset assetCountReport={assetCountReport!} />
        </div>
    )
}