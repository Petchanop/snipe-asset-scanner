import "@/globals.css";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ReactNode, Suspense } from "react";
import { LoadingSkeleton } from "@/_components/loading";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Providers from "@/provider";
import { getSession } from "auth";
import Image from "next/image";
import CititexLogo from "@/public/cititexlogo.png"

export const metadata: Metadata = {
  title: "Snipe-it asset tracker",
  description: "Cititex group asset count program",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession()
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial=scale=1.0" />
        <link rel="icon" href="./favicon.ico" sizes="any" />
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <main className="w-full h-svh flex justify-center overflow-auto">
            <Suspense fallback={<LoadingSkeleton />}>
              <Card className='w-screen h-screen absolute'
                sx={{
                  borderRadius: {
                    lg: 4
                  }
                }}
              >
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
                <Providers session={session}>
                  {children}
                </Providers>
              </Card>
            </Suspense>
          </main>
        </AppRouterCacheProvider>
      </body>
    </html >
  );
}
