'use server'
import { prisma } from "@/_libs/prisma";
import * as bcrypt from 'bcrypt';

export async function CreateAssetCountUser(userInput: any) {
    console.log('user input ', userInput)
    const user = await prisma.users.findFirst({
        where: {
            first_name: userInput.FirstName,
            last_name: userInput.LastName
        }
    })
    console.log("can create user ",user)
    if (!user)
        return null
    const hashPassword = await bcrypt.hash(userInput.Password, parseInt(process.env.SALT_ROUNDS as string) as number)
    console.log(hashPassword)
    return await prisma.asset_count_user.create({
        data: {
            id: user.id,
            user_id : user.id,
            username : user.username as string,
            password: hashPassword 
        }
    })
}

export async function GetAssetCountUser(data: any) {
    const user = await prisma.asset_count_user.findFirst({
        where: {
            username: data.Username
    }})
    return user
}