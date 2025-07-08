import ScannerComponent from "@/_components/scanner"
import SearchAsset from "@/_components/tables/search-asset"
import Typography from "@mui/material/Typography"

export default async function CheckAssetPage({ searchParams }: { searchParams: { location: Promise<string> } }) {
    const { location } = await searchParams
    const locationId = await location
    console.log("start count page" , locationId, location)
    //fetch data here
    //use mock data before implement api call
    //fetch location from snipe api
    return (
         <div className="p-4">
            <Typography>Check asset</Typography>
            <SearchAsset />
        </div>
    )
}