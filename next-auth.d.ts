import { DefaultSession, DefaultUser } from 'next-auth'

declare module "next-auth" {
    export interface Session {
        user: User & DefaultSession["user"] & {
            firstName: string,
            lastName: string,
        }
    }
    export interface JWT {
        token: {
            id: string,
            name: string,
            firstName: string,
            lastName: string
        }
    }
    export interface User extends DefaultUser {
        user: {
            firstName: string,
            lastName: string,
        }
    }
}