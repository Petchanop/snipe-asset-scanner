'use server'

import { createGateway } from "@/_apis/next.api";
import { TAsset } from "@/_types/snipe-it.type";

export async function fetchSearchAsset(searchInput: string) : Promise<TAsset>{
    const client = await createGateway();
    const {data, error} = await client.GET("/hardware/bytag/{asset_tag}", {
        params: {
            path: { asset_tag: searchInput }
            }
        }
    )
    if (error)
        return error
    console.log(data)
    return data
}