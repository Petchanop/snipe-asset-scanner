import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            username: string,
            id: string
        } & DefaultSession["user"]
    }
    interface JWT {
        token: {
            id: string,
            name: string
        }
    }
}