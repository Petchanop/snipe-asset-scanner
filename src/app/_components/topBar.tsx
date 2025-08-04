
'use client'
import CardHeader from "@mui/material/CardHeader";
import Image from 'next/image'
import CititexLogo from "@/public/cititexlogo.png"
import { signOut, useSession } from "next-auth/react"
import Button from "@mui/material/Button";

export default function TopBar() {
  const session = useSession()
  console.log(session.data)
  return (
    <>
      <CardHeader
        className='h-1/8 bg-blue-400 text-white'
        avatar={
          <Image
            width={150}
            height={50}
            src={CititexLogo.src}
            alt="cititex logo"
          />
        }
        slotProps={{
          title: {
            className: 'max-md:text-xl text-lg lg:text-2xl max-sm:hidden mx-6'
          }
        }}
        title="Asset Count"
      >
      </CardHeader>
      {
        session.data ?
          <Button
            className="absolute end-5 top-6.5  text-white text-md"
            onClick={() => signOut()}
          >Sign out
          </Button> : <></>
      }
    </>
  )
}