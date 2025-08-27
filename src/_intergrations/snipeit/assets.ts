'use server'
import { checkIfIsTStatusResponse, createGateway, TResponse, TStatusResponse } from "@/_intergrations/next.api";
import { ConvertImageUrl } from "@/_libs/convertUrl";
import { AssetResponse } from "@/_intergrations/snipeit/snipe-it";

const client = await createGateway();
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
    if (data)
        data.image = ConvertImageUrl(process.env.SNIPE_URL as string, data?.image as string)
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

export async function getAssetByLocationId(
    locationId: number
): Promise<TResponse<AssetResponse[]>> {
    const { data, error } = await client.GET("/hardware", {
        params: {
            query: { location_id: locationId }
        }
    })
    if (error) {
        return { data: null, error: error }
    }
    return { data: data.rows as AssetResponse[], error: null }
}