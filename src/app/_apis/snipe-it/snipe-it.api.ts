'use server'

import { checkIfIsTStatusResponse, createGateway, TResponse, TStatusResponse } from "@/_apis/next.api";
import { TAsset } from "@/_types/snipe-it.type";

type AssetResponse = Exclude<TAsset, TStatusResponse> 
export async function fetchSearchAsset(searchInput: string) : Promise<TResponse<AssetResponse>>{
    const client = await createGateway();
    const {data, error} = await client.GET("/hardware/bytag/{asset_tag}", {
        params: {
            path: { asset_tag: searchInput }
            }
        }
    )
    if (error)
        return {data: null , error: error}
    if (checkIfIsTStatusResponse(data)) {
        return { data: null , error: data as TStatusResponse}
    }
    return { data: data as AssetResponse, error: null }
}