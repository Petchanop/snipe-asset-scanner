'use client'
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';
import LocationTable from '@/_components/tables/location-table';
import { useState } from 'react';

interface ActionTable {
    [key: string]: boolean
}

const ActionTable : ActionTable = {
    "showLocation": false,
    "checkAsset": false,
    "reportAsset" : false
}

export default function AssetCountTable() {
    const [table, setTable] = useState<ActionTable>(ActionTable)
    return (
        <>
            <Card className='w-screen h-screen lg:w-4/6 lg:h-3/4 absolute lg:top-22'
                sx={{ borderRadius: 4 }}
            >
                <CardHeader
                    className='h-1/6 bg-blue-400 text-white'
                    title="Asset Count"
                />
                <CardContent>
                    <Paper>
                        <TableContainer sx={{ maxHeight: 440 , border: 1, borderColor: 'gray' }}>
                            <LocationTable />
                        </TableContainer>
                    </Paper>
                </CardContent>
            </Card>
        </>
    )
}