import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { GetAssetCountUser } from "@/api/auth.api";
import * as bcrypt from 'bcrypt'
import { User } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Asset Count",
      credentials: {
        username: {
          label: "UserName",
          type: "text",
        },
        password: { label: "Password", type: "password" }
      },


      async authorize(credentials, req) {
        const user = await GetAssetCountUser(credentials)
        if (!user)
          throw new Error('Invalid username or password') 
        const comparePassword = await bcrypt.compare(credentials?.password as string, user?.password as string)
        if (user && comparePassword) {
          return new Promise((resolve) => {
            resolve({
              id: user?.id.toString() as string,
              name: user?.username as string,
              // @ts-ignore
              firstName: user?.user.first_name as string,
              lastName: user?.user.last_name
            })
          })
        } else {
          throw new Error('Invalid username or password') 
        }
      }
    }
    )],
  session: {
    jwt: true,
    maxAge: 5 * 60
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      const isSignIn = user ? true : false
      if (isSignIn) {
        token.id = user!.id
        token.name = user!.name
        token.firstName = user!.firstName
        token.lastName = user!.lastName
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      return { ...session, user: { ...token } }
    },
  }
}

export const getSession = () => getServerSession(authOptions)

