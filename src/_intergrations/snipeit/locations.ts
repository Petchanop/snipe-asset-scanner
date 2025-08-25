'use server'
import { TLocation } from "@/_types/snipe-it.type"
import { createGateway, TResponse } from "@/_intergrations/next.api"
import { TArrayResponse } from "@/_intergrations/snipeit/snipe-it"

const client = await createGateway();
export async function fetchLocations(): Promise<TResponse<TArrayResponse<TLocation>>> {
    const { data, error } = await client.GET("/locations")
    if (error) {
        return { data: null, error: error }
    }
    else if ("rows" in data && "total" in data) {
        return { data: { total: data.total, rows: data.rows }, error: null }
    }
    return { data: null, error: data }
}

export async function getLocationById(id: number) : Promise<Location | null> {
    const { data, error } = await client.GET(`/locations/{id}`, {
        params: {
            path: { id: id }
        }
    })
    if (error) {
        return null;
    }
    return data as unknown as Location;
}