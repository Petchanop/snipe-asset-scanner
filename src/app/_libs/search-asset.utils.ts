import { AddAssetCountLine } from "@/api/report.api"
import { AssetResponse } from "@/api/snipe-it/snipe-it.api"
import { assetStatusOptions } from "@/_constants/constants"
import { AssetCount, AssetCountLine, TAssetRow, AssetCountLocation, User, assetUser, ExtendAssetResponse } from "@/_types/types"
import { UpdateAssetCountLine } from "./report.utils"
import { TLocation } from "@/_types/snipe-it.type"

export async function CreatAssetCountLine(
    data: AssetResponse,
    assetCountReport: AssetCount,
    assetInReport: AssetCountLine[],
    locationId: AssetCountLocation,
    user: any
): Promise<TAssetRow> {
    const extendTypeAsset: ExtendAssetResponse = {
        ...data,
        asset_name_not_correct: false,
        is_not_asset_loc: data.location?.id != locationId.location_id,
        asset_check: true,
        checked_by: parseInt(user.id) as number,
        in_report: assetInReport.find((report) => report.asset_code === data.asset_tag) ? true : false,
        location_id: locationId.id,
        is_assigned_incorrectly: false,
        status: assetStatusOptions.find((status) => status.value.toLowerCase() == data.status_label?.status_meta as string)?.value as string,
        prev_location: data.location as unknown as TLocation,
        image: data.image as string
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
        assignIncorrect: assetCountLine.is_assigned_incorrectly,
        notInLocation: assetCountLine.is_not_asset_loc ? assetCountLine.is_not_asset_loc : false,
        status: assetCountLine.asset_count_line_status_id,
        prev_location: data.location,
        image: assetCountLine.image
    } as unknown as TAssetRow
    return asset
}

export async function UpdateAssetCountLineForSearchAssetPage(
    assetInReport:AssetCountLine[], 
    data : AssetResponse,
    assetCountReport : AssetCount,
    users: User[],
    locationId : AssetCountLocation,
    user: any
) {
    const IsInLocation = assetInReport.find((result) => result.asset_code == data.asset_tag)
    let asset: TAssetRow
    if (!IsInLocation) {
        asset = await CreatAssetCountLine(data, assetCountReport, assetInReport, locationId, user)
        await UpdateAssetCountLine(asset.id as string, { asset_check: true })
    } else {
        const result = await UpdateAssetCountLine(IsInLocation.id, { asset_check: true })
        const assigned_to = users.find((data: User) => data.id == result?.assigned_to as number)
        asset = {
            id: result?.id,
            assetCode: result?.asset_code as string,
            assetName: result?.asset_name as string,
            assignedTo: { id: assigned_to?.id, first_name: assigned_to?.first_name, last_name: assigned_to?.last_name} as assetUser,
            countCheck: result?.asset_check as boolean,
            assignIncorrect: result?.is_assigned_incorrectly as boolean,
            notInLocation: result?.is_not_asset_loc as boolean,
            status: result?.asset_count_line_status_id as number,
            prev_location: data.location?.name as string,
            image: result?.image as string
        }
    }
    return asset
}