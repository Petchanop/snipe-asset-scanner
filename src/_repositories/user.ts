'use server'
import { User } from "@/_types/types";
import { prisma } from "@/_libs/prisma"
import * as bcrypt from 'bcrypt';

export async function CreateAssetCountUser(userInput: any) {
    const user = await prisma.users.findFirst({
        where: {
            first_name: userInput.FirstName,
            last_name: userInput.LastName
        }
    })
    if (!user)
        return null
    const hashPassword = await bcrypt.hash(userInput.Password, parseInt(process.env.SALT_ROUNDS as string) as number)
    return await prisma.asset_count_user.create({
        data: {
            id: user.id,
            user_id: user.id,
            username: userInput.FirstName + '.' + userInput.LastName[0] as string,
            password: hashPassword
        }
    })
}

export async function GetAssetCountUser(data: any) {
    const user = await prisma.asset_count_user.findFirst({
        where: {
            username: data.username
        },
        include: {
            user: true
        }
    })
    return user
}

export async function getUserByIdPrisma(userId: number): Promise<Partial<User> | null> {
    return await prisma.users.findUnique({
        where: {
            id: userId
        },
        select: {
            first_name: true,
            last_name: true,
            id: true
        }
    })
}

export async function GetAllUserPrisma(): Promise<User[]> {
    return await prisma.users.findMany()
}