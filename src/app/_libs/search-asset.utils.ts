import { AddAssetCountLine } from "@/_apis/report.api"
import { AssetResponse } from "@/_apis/snipe-it/snipe-it.api"
import { ExtendAssetResponse } from "@/_components/tables/search-asset"
import { assetStatusOptions } from "@/_constants/constants"
import { AssetCount, AssetCountLine, TAssetRow, AssetCountLocation } from "@/_types/types"

export async function CreatAssetCountLine(
    data : AssetResponse, 
    assetCountReport : AssetCount , 
    assetInReport : AssetCountLine[], 
    locationId: AssetCountLocation) : Promise<TAssetRow> {
    const extendTypeAsset: ExtendAssetResponse = {
        ...data,
        asset_name_not_correct: false,
        is_not_asset_loc: data.location?.id != locationId.location_id,
        asset_check: false,
        in_report: assetInReport.find((report) => report.asset_code === data.asset_tag) ? true : false,
        location_id: locationId.id,
        status: assetStatusOptions.find((status) => status.value.toLowerCase() == data.status_label?.status_meta as string)?.value as string
    }
    const assetCountLine = await AddAssetCountLine(extendTypeAsset, assetCountReport)
    const asset = {
        id: assetCountLine.id,
        assetCode: assetCountLine.asset_code,
        assetName: assetCountLine.asset_name,
        assignedTo: {
            id: data?.id,
            first_name: data.assigned_to!.first_name,
            last_name: data.assigned_to!.last_name
        },
        countCheck: assetCountLine.asset_check ? assetCountLine.asset_check : false,
        assignIncorrect: assetCountLine.is_not_asset_loc ? assetCountLine.is_not_asset_loc : false,
        status: assetCountLine.asset_count_line_status_id
    } as unknown as TAssetRow
    return asset
}