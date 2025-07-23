import { prisma } from "@/_libs/prisma"
import { Location } from "@/_types/types"
import { createGateway, TResponse } from "@/_apis/next.api";
import { TLocation } from "@/_types/snipe-it.type";

const client = await createGateway();

export async function getLocationById(location: number) : Promise<Location | null>{
    return await prisma.locations.findUnique({ where : { id: location }})
}

export async function getLocationByIdSnipeIt(location: number) : Promise<TResponse<TLocation>>{
    const { data, error } = await client.GET("/locations/{id}", {
        params: {
            path: {
                id : location
            }
        }
    })
    if (error) {
        return { data: null, error: error}
    }
    return { data: data, error: null}
}