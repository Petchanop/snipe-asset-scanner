import createClient, { Client } from "openapi-fetch";
import type {paths} from "../../../snipe-it.schema";
//use next public url because it need to expose env variable to client component

export type TStatusResponse = {
    status?: string;
    messages?: string;
};

export type TResponse<T> = { data : T, error: null } | { data: null, error: TStatusResponse}

export function checkIfIsTStatusResponse(data: unknown): data is TStatusResponse {
    return typeof data === 'object' &&
        data != null &&
        ('status' in data) && ('messages' in data)
}

export async function createGateway() : Promise<Client<paths>> {
    const client: Client<paths> = createClient<paths>({
    baseUrl: process.env.SNIPE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.SNIPE_AUTH_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }})
    return client
}
