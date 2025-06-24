import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow"

type AssetRow = {
    assetCode: string;
    assetName: string;
    assignedTo: string;
    countCheck: boolean;
    assignIncorrect: boolean;
};

function createAssetTableCell(data: AssetRow, isCheckTable: boolean) {
    const { assetCode, assetName, assignedTo, countCheck, assignIncorrect } = data;
    return (
        <>
            <TableCell>
                {assetCode}
            </TableCell>
            <TableCell>
                {assetName}
            </TableCell>
            <TableCell>
                {assignedTo}
            </TableCell>
            <TableCell>
                {countCheck}
                <Checkbox checked={countCheck} disabled={!isCheckTable} />
            </TableCell>
            <TableCell>
                {assignIncorrect}
                <Checkbox checked={assignIncorrect} disabled={!isCheckTable} />
            </TableCell>
        </>
    )
}

export default function ListAsset(props: { data: AssetRow[], isCheckTable: boolean }) {
    const { data, isCheckTable } = props
    return (
        <>
        {
            data.length ?
                (data).map((mockData: AssetRow) =>
                    <TableRow key={mockData.assetCode}>
                        {createAssetTableCell(mockData, isCheckTable)}
                    </TableRow>
                )
                : <></>
        }
        </>
    )
}