'use server'
import { TUser, TUserList } from "@/_types/snipe-it.type"
import { createGateway, TResponse } from "@/_intergrations/next.api"

const client = await createGateway();
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