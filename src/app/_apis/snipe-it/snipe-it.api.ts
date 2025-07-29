'use server'

import { checkIfIsTStatusResponse, createGateway, TResponse, TStatusResponse } from "@/_apis/next.api";
import { TAsset, TLocation, TUser, TUserList } from "@/_types/snipe-it.type";

const client = await createGateway();
export type AssetResponse = Exclude<TAsset, TStatusResponse>
export async function fetchSearchAsset(searchInput: string) : Promise<TResponse<AssetResponse>>{
    const result = await client.GET("/hardware/bytag/{asset_tag}", {
        params: {
                path: { asset_tag: searchInput }
            }
        }
    )
    const { error } = result
    let { data } = result
    if (searchInput.includes('/')) {
        const requestOption = {
            method: "GET",
            headers:  {
            'Authorization': `Bearer ${process.env.SNIPE_AUTH_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }}
        const request = `${process.env.SNIPE_URL}/hardware/bytag/${searchInput}`
        data = await fetch(request, requestOption)
        .then((response) => response.json())
        .then((result) => {
            return result
        }) as AssetResponse
    }
    if (error && !JSON.stringify(data))
        return {data: null , error: error}
    if (checkIfIsTStatusResponse(data)) {
        return { data: null , error: data as TStatusResponse}
    }
    return { data: data as AssetResponse, error: null }
}

export async function getAssetById(assetId: number) : Promise<TResponse<AssetResponse>>{
    const { data, error } = await client.GET("/hardware/{id}", {
        params: {
            path: { id: assetId}
        }
    })
    if (error) {
        return {data: null,  error: error}
    }
    return { data: data as AssetResponse, error: null}
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

export async function getAllUser() : Promise<TResponse<TUserList>> {
    const { data, error } = await client.GET("/users")
    if (error) {
        return { data: null, error: error}
    }
    return { data: data, error: null}
}
