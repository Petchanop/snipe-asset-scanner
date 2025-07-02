'use server'

import { checkIfIsTStatusResponse, createGateway, TResponse, TStatusResponse } from "@/_apis/next.api";
import { TAsset, TLocation } from "@/_types/snipe-it.type";

const client = await createGateway();
type AssetResponse = Exclude<TAsset, TStatusResponse>
export async function fetchSearchAsset(searchInput: string) : Promise<TResponse<AssetResponse>>{
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

type TArrayResponse<T> = {
    total: number;
    rows:  T[];
}

export async function fetchLocations() : Promise<TResponse<TArrayResponse<TLocation>>>{
    const { data, error } = await client.GET("/locations")
    if (error) {
        return { data: null, error: error}
    }
    else if ("rows" in data && "total" in data) {
        return { data: { total: data.total, rows: data.rows} , error: null}
    }
    return { data: null, error: data}
}
