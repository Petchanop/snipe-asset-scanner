import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { GetAssetCountUser } from "@/api/auth.api";
import { redirect } from "next/navigation";
import * as bcrypt from 'bcrypt'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: {
          label: "UserName",
          type: "text",
        },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, req) {
        const user = await GetAssetCountUser(credentials)
        const comparePassword = await bcrypt.compare(credentials?.password as string, user?.password as string)
        if (user && comparePassword) {
          return new Promise((resolve, reject) => {
            resolve({
            id: user?.id.toString() as string,
            name: user?.username as string
          })})
        } else {
          return redirect('unauthorized')
        }}
      }
  )],
  session : {
    jwt: true,
    maxAge:5*60
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      const isSignIn = user ? true : false
      if (isSignIn) {
        token.id = user!.id
        token.name = user!.name
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      return {...session, user: { id: token.id, name : token.name } }
    },
  }
}

export const getSession = () => getServerSession(authOptions)

