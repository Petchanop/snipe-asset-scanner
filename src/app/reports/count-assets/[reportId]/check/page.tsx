import SearchAsset from "@/_components/tables/search-asset"
import { prisma } from "@/_libs/prisma"
import { getAssetCountLineByAssetCount } from "@/_libs/report.utils"
import { AssetCount } from "@/_types/types"
import Typography from "@mui/material/Typography"

export default async function CheckAssetPage(
    { params }: { params :  Promise<{ reportId: string}> }, 
) {
    const { reportId } = await params
    const  documentNumber = await reportId
    //fetch data here
    //use mock data before implement api cal
    //fetch location from snipe api
    const assetCountReport : AssetCount | null = await prisma.asset_count.findUnique( {
        where: {
            document_number : documentNumber
        }
    })
    const assetInReport = await getAssetCountLineByAssetCount(assetCountReport!.id!)
    return (
         <div className="p-4">
            <Typography>Check asset</Typography>
            <SearchAsset 
            assetCountReport={assetCountReport!} 
            assetInReport={assetInReport}
            />
        </div>
    )
}