
'use client'
import CardHeader from "@mui/material/CardHeader";
import Image from 'next/image'
import CititexLogo from "@/public/cititexlogo.png"
import { signOut } from "next-auth/react"
import Button from "@mui/material/Button";

export default function TopBar(props: { session?: any }) {
  const { session } = props
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
            className: 'max-md:text-xl lg:text-2xl pl-'
          }
        }}
        title="Asset Count"
      />
      {
        session ? 
          <Button 
            className="absolute end-5" 
            onClick={() => signOut()}
          >Sign out
          </Button>: <></>
      }
    </>
  )
}