import SearchAsset from "@/_components/tables/search-asset";
import { Typography } from "@mui/material";

export default function SearchPage() {
    return (
        <div className="p-4">
            <Typography>Search asset</Typography>
            <SearchAsset />
        </div>
    )
}