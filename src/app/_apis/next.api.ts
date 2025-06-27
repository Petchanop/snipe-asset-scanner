import createClient, { Client } from "openapi-fetch";
import type {paths} from "../../../snipe-it.schema";
//use next public url because it need to expose env variable to client component

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
