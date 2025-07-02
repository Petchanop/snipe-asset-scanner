import prisma from "@/_libs/prisma";
import { createGateway } from "./next.api";


export async function getReport(location: string) {
    const client = await createGateway();
    const { data, error } = await prisma.
}