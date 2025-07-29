import { getAssetCountReport } from "@/_libs/report.utils";
import * as XLSX from 'xlsx'
import { NextRequest } from "next/server";
import { AssetCountWithLineAndLocation } from "@/_types/interfaces";

export async function GET(
    request: NextRequest,
    { params } : { params : { reportId : string }}
) {
    try {
        const { reportId } = await params
        if (!reportId) throw new Error('Report id required')
        const assetCountReport = await getAssetCountReport(parseInt(reportId), true, true) as AssetCountWithLineAndLocation
        const workbook = XLSX.utils.book_new()
        const readWorkBook = XLSX.readFile('./Asset_Report.xlsx')
        console.log(readWorkBook.Sheets)
        const worksheet = XLSX.utils.json_to_sheet([assetCountReport])
        XLSX.utils.book_append_sheet(workbook, worksheet, assetCountReport?.document_name as string)
        const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"})
        return new Response( JSON.stringify(readWorkBook.Sheets, null, 2), {
            status: 200,
            headers: {
                'Content-Disposition' : 'inline',
                'Content-type' : `application/json`
            }
        })
        // return new Response( excelBuffer, {
        //     status: 200,
        //     headers: {
        //         'Content-Disposition': `attachment; filename="${assetCountReport?.document_name}.xlsx"`,
        //         'Content-Type': 'application/vnd.ms-excel'
        //     }
        // })
    } catch (e) {
        if (e instanceof Error) {
            return new Response(e.message , {
                status: 400
            })
        }
    }
}