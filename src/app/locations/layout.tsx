import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Link from "next/link";
import { ReactNode } from "react";

export default function TableLayout({
    children,
}: {
    children: ReactNode
}) {
    return <>
        <Card className='w-screen h-screen lg:w-4/6 lg:h-3/4 absolute lg:top-22'
            sx={{ borderRadius: 4 }}
        >
            <CardHeader
                className='h-1/8 bg-blue-400 text-white'
                title="Asset Count"
            />
            <CardContent className="space-y-4">
                <div className="pl-2 space-x-4">
                    <Link
                        href="/locations/assets"
                        className={`
                            hover:bg-blue-200 w-20 
                            outline-solid outline-offset-2 
                            outline-blue-400
                            rounded-md`}
                    >
                        <span className="m-4 text-blue-400">New Count</span>
                    </Link>
                    <Link
                        href="/locations"
                        className={`
                            hover:bg-blue-200 w-20 
                            outline-solid outline-offset-2
                            outline-blue-400
                            rounded-md`}
                    >
                        <span className="m-4 text-blue-400">Location</span>
                    </Link>
                </div>
                <Paper elevation={10}>
                    <TableContainer className="lg:max-h-[55vh] max-h-[75vh]">
                        {children}
                    </TableContainer>
                </Paper>
            </CardContent>
        </Card >
    </>
}