'use client'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Link from "next/link";
import { ReactNode, useState } from "react";

export default function TableLayout({
    children,
}: {
    children: ReactNode
}) {
    const [selected, setSelected] = useState<string>("reports")

    function addBgBlueIfClick(match: string) : string {
        return selected === match ? "bg-blue-200" : ""
    }

    return <>
        <Card className='w-screen h-screen lg:w-4/6 lg:h-3/4 absolute lg:top-22'
            sx={{
                borderRadius: {
                    lg: 4
                }
            }}
        >
            <CardHeader
                className='h-1/8 bg-blue-400 text-white'
                title="Asset Count"
            />
            <CardContent className="space-y-4">
                <div className="pl-2 space-x-4">
                    {/* <Select 
                        labelId="navigation-select-box"
                        id="navigation-select-box"
                        value={selected}
                        onChange={(event) => setSelected(event.target.value)}
                    >
                        <MenuItem value="locations"> */}
                    <Link
                        href="/reports"
                        className={`
                            hover:bg-blue-200 w-20 
                            ${addBgBlueIfClick("location")}
                            outline-solid outline-offset-2 
                            outline-blue-400
                            rounded-md`}
                        onClick={() => setSelected("report")}
                    >
                        {/* <Link href="/locations"> */}
                        <span className="m-4 text-blue-400">Report</span>
                    </Link>
                    {/* </MenuItem> */}
                    {/* <MenuItem value="new-count"> */}
                    <Link
                        href="/locations/assets"
                        className={`
                            hover:bg-blue-200 w-20
                            ${addBgBlueIfClick("newcount")}
                            outline-solid outline-offset-2
                            outline-blue-400
                            rounded-md`}
                        onClick={() => setSelected("newcount")}
                    >
                        {/* <Link href="/locations/assets"> */}
                        <span className="m-4 text-blue-400">New count</span>
                    </Link>
                    {/* </MenuItem>
                    </Select> */}
                    <Link
                        href="/locations/assets/search"
                        className={`
                            hover:bg-blue-200 w-20 
                            ${addBgBlueIfClick("search")}
                            outline-solid outline-offset-2
                            outline-blue-400
                            rounded-md`}
                        onClick={() => setSelected("search")}
                    >
                        {/* <Link href="/locations/assets"> */}
                        <span className="m-4 text-blue-400">Search</span>
                    </Link>
                </div>
                <Paper elevation={10}>
                    <TableContainer className="w-full lg:max-h-[55vh] max-h-[75vh]">
                        {children}
                    </TableContainer>
                </Paper>
            </CardContent>
        </Card >
    </>
}