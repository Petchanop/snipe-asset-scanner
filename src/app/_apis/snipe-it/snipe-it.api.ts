'use server'

import { checkIfIsTStatusResponse, createGateway, TResponse, TStatusResponse } from "@/_apis/next.api";
import { TAsset, TLocation, TUser } from "@/_types/snipe-it.type";

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

export async function getUserById(Id : number) : Promise<TResponse<TUser>> {
    const {data, error } = await client.GET("/users/{id}", {
        params: {
            path: { id: Id }
            }
        }
    )
    if (error) {
        return { data: null, error: error}
    }
    return {data: data, error: null}
}
