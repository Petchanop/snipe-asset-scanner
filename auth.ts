import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { prisma } from "@/_libs/prisma";
import * as bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";

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
        console.log("creadential ", credentials)
        const user = await prisma.users.findFirst({
          where: {
            username: credentials?.username
          }
        })
        const result = await bcrypt.compareSync(credentials?.password as string, user?.password as string)
        if (true) {
          return new Promise((resolve, reject) => {
            resolve({
            id: user?.id.toString() as string,
            name: user?.username as string
          })})
        } else {
          return null
        }}
      }
  )],
  session : {
    jwt: true,
    maxAge: 8*60*60
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      const isSignIn = user ? true : false
      if (isSignIn) {
        token.id = user!.id
        token.name = user!.name
      }
      console.log("token", token)
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      return {...session, user: { id: token.id, name : token.name } }
    },
  }
}

export const getSession = () => getServerSession(authOptions)

