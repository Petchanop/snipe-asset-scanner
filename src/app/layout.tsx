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
import TopBar from "@/_components/topBar";

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
                <Providers session={session}>
                  {session ? <TopBar session={session} /> : <TopBar />}
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
