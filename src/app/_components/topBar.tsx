
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
            className: 'max-md:text-xl text-lg lg:text-2xl max-md:hidden max-lg:mx-6'
          }
        }}
        title="Asset Count"
      >
      </CardHeader>
       {
        session ? 
          <Button 
            className="absolute end-5 max-lg:top-5.5 lg:top-10 text-white text-lg" 
            onClick={() => signOut()}
          >Sign out
          </Button>: <></>
      }
    </>
  )
}