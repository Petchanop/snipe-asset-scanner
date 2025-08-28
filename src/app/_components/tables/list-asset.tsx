import {
  AssetStatusEnum,
  INLOCATION,
  assetStatusOptions,
  rowsPerPageOptions,
  startRowsPerPage,
  tableHeaders,
  tableHeadersAdditional
} from "@/_constants/constants";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  MouseEvent,
} from "react";
import {
  dataPerPage,
  getComparator,
  handleChangePage,
  handleChangeRowsPerPage,
  Order
} from "@/_components/tables/utility";
import { OUTLOCATION, TAssetRow, TAssetTab, userNameId } from "@/_types/types";
import { JSX } from "@emotion/react/jsx-runtime";
import Checkbox from "@mui/material/Checkbox";
import { blue } from "@mui/material/colors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow"
import { UpdateAssetCountLine } from "@/_repositories/assetCountLine";
import TableSortLabel from "@mui/material/TableSortLabel";
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useReportContext } from "@/_contexts/context";
import ImageComponent from "@/_components/ImageComponent";
import { decode } from 'html-entities'
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useSession } from "next-auth/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export function CreateAssetTableCell(
  props: {
    data: TAssetRow,
    assetTab: TAssetTab,
    action: JSX.Element,
    actionLabel: string,
    isCheckTable: boolean,
    user: any,
    users: userNameId[]
  }) {
  const { data, assetTab, actionLabel, action, isCheckTable, user, users } = props
  const { assetCode, assetName, assignedTo, countCheck, assignIncorrect, notInLocation, status, image, remarks, ownedBy } = data;
  const ownedAsset = users.find((user) => user.id == ownedBy)
  const [count, setCount] = useState(countCheck)
  const [incorrect, setIncorrect] = useState(assignIncorrect)
  const [wrongLocation, setWrongLocation] = useState(notInLocation)
  const [open, setOpen] = useState(false)
  const [remarkAsset, setRemarkAsset] = useState(remarks)
  const [owner, setOwner] = useState<userNameId | undefined | null>(ownedAsset == undefined ? null : ownedAsset)
  const [assetStatus, setAssetStatus] = useState(assetStatusOptions.find((option) => option.id == status)?.id == AssetStatusEnum.MALFUNCTIONING)
  const tabType = !notInLocation ? INLOCATION : OUTLOCATION
  const reportContext = useReportContext()
  // const readOnlyUsers: readonly User[] = users
  const autoCompleteProps = {
    options: users,
    getOptionLabel: (option: userNameId) => option.name,
    isOptionEqualToValue: (option: userNameId, value: userNameId) => option.id === value.id
  }

  useEffect(() => {
    const updateRemark = async () => {
      if (reportContext.update) {
        await UpdateAssetCountLine(data.id as string,
          { remarks: remarkAsset, checked_by: parseInt(user.id) }
        )
      }
    }
    updateRemark()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportContext.update, data.id])
  return (
    <>
      {
        tabType == assetTab ?
          <>
            <TableCell>
              {assetCode}
            </TableCell>
            <TableCell>
              <Button variant="text" onClick={() => setOpen((prev) => !prev)}>
                {decode(assetName)}
              </Button>
              <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClick={() => setOpen((prev) => !prev)}
              >
                <DialogTitle id="alert-dialog-title">
                  {decode(assetName)}
                </DialogTitle>
                <DialogContent>
                  <ImageComponent
                    src={image}
                    alt={assetName as string}
                    width={400}
                    height={400}
                  />
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>
              {assignedTo.first_name} {assignedTo.last_name}
            </TableCell>
            {
              assetTab ?
                <TableCell className="" align="center" padding="checkbox">
                  <Checkbox checked={count}
                    disabled={!isCheckTable}
                    onChange={async (event) => {
                      const updateData = async () => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        data.countCheck = event.target.checked,
                          await UpdateAssetCountLine(data.id as string, {
                            asset_check: data.countCheck,
                            checked_by: parseInt(user?.id)
                          })
                      }

                      await updateData()
                      setCount(pre => !pre)
                    }}
                  />
                </TableCell>
                : <></>
            }
            <TableCell className="relative" align="center" padding="checkbox">
              <>
                <Checkbox
                  checked={incorrect}
                  disabled={!isCheckTable}
                  onChange={async (event) => {
                    const updateAssignNotCorrect = async () => {
                      data.assignIncorrect = event.target.checked
                      await UpdateAssetCountLine(data.id as string, {
                        is_assigned_incorrectly: event.target.checked,
                        checked_by: parseInt(user?.id)
                      })
                    }

                    await updateAssignNotCorrect()
                    setIncorrect(pre => !pre)
                  }}
                />

              </>
            </TableCell>
            <TableCell className="" align="center" padding="checkbox">
              <Checkbox
                checked={wrongLocation}
                disabled={!isCheckTable}
                onChange={async (event) => {
                  const updateIncorrectLocation = async () => {
                    data.notInLocation = event.target.checked
                    await UpdateAssetCountLine(data.id as string, {
                      is_not_asset_loc: event.target.checked,
                      checked_by: parseInt(user?.id)
                    })
                  }
                  await updateIncorrectLocation()
                  setWrongLocation(pre => !pre)
                }} />
            </TableCell>
            {
              !assetTab ?
                <TableCell>
                  {action} {actionLabel}
                </TableCell>
                : <></>
            }
            <TableCell align="center" padding="checkbox">
              <Checkbox
                checked={assetStatus}
                onChange={async (event) => {
                  const updateAssetStatus = async () => {
                    data.status = event.target.checked ? AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
                    await UpdateAssetCountLine(data.id as string, {
                      asset_count_line_status_id: data.status,
                      checked_by: parseInt(user?.id)
                    })
                  }
                  await updateAssetStatus()
                  setAssetStatus(pre => !pre)
                }}
                disabled={!isCheckTable}
              >
              </Checkbox>
            </TableCell>
            <TableCell>
              <Autocomplete
                {...autoCompleteProps}
                disabled={!incorrect || !isCheckTable}
                id="employee name autocomplete"
                className="w-[16rem] z-20 shadow-md focus:outline-none bg-white"
                value={owner}
                onChange={async (event: any, newValue: userNameId | null) => {
                  setOwner(newValue!)
                  if (newValue != null) {
                    await UpdateAssetCountLine(data.id as string,
                      { owned_by: newValue.id, checked_by: parseInt(user.id) }
                    )
                  } else {
                    if (ownedBy) {
                      await UpdateAssetCountLine(data.id as string,
                        { owned_by: null, checked_by: parseInt(user.id) }
                      )
                    }
                  }
                }}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props
                  return (
                    <Box
                      key={optionProps.id + key}
                      component="li"
                      sx={{ padding: 4 }}
                      {...optionProps}
                    >
                      {option.name}
                    </Box>
                  )
                }}
                renderInput={(params) => (
                  <TextField {...params} label="employee name" />
                )}
              />
            </TableCell>
            {
              tabType == OUTLOCATION ?
                <TableCell align="center">
                  <TextareaAutosize
                    id="remark"
                    onChange={(event) => setRemarkAsset(event.target.value)}
                    value={remarkAsset}
                    className="w-full"
                  />
                </TableCell>
                : <></>
            }
          </>
          : <></>
      }
    </>
  )
}

export default function ListAsset(props: {
  data: TAssetRow[], isCheckTable: boolean,
  assetTab: TAssetTab, users: userNameId[],
  page: number, rowsPerPage: number
}) {
  const { data, isCheckTable, assetTab, page, rowsPerPage, users } = props
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof TAssetRow>('assetCode')
  const headers = assetTab == INLOCATION ? tableHeaders : tableHeadersAdditional
  const { data: session } = useSession()

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof TAssetRow
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property: keyof TAssetRow) => (event: MouseEvent<unknown>) => {
    handleRequestSort(event, property)
  }

  const tableData = useMemo(() => data
    .sort(getComparator<TAssetRow, keyof TAssetRow>(order, orderBy)),
    [order, orderBy, data]
  )


  return (
    <>
      <TableHead>
        <TableRow className="place-content-center">
          {headers.map((header) => (
            <TableCell key={header.label}
              className="bg-blue-300 font-medium"
            >
              <TableSortLabel
                active={orderBy === header.value}
                direction={orderBy === header.value ? order : 'asc'}
                onClick={createSortHandler(header.value)}>
                {header.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody sx={{ overflow: 'hidden' }} className="place-content-center">
        {
          tableData.length ?
            dataPerPage(tableData, page, rowsPerPage).map((mockData: TAssetRow) =>
              <TableRow key={mockData.assetCode} className="divide-x-1 divide-solid divide-gray-300">
                <CreateAssetTableCell
                  data={mockData}
                  assetTab={assetTab}
                  action={<Checkbox disabled={!isCheckTable} />}
                  actionLabel={"[Del]"}
                  isCheckTable={isCheckTable}
                  user={session?.user}
                  users={users}
                />
              </TableRow>
            ) :
            <TableRow sx={{
              height: '9rem',
              maxHeight: '9rem'
            }}>
              <TableCell colSpan={2} />
              <TableCell
                className="justify-center"
                colSpan={3}
                rowSpan={8}>
                No asset report
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
        }
      </TableBody>
    </>
  )
}

export function AssetTable(props: {
  data: TAssetRow[],
  isCheckTable: boolean,
  assetTab: TAssetTab,
  setAssetTab: (value: SetStateAction<TAssetTab>) => void,
  tabValue?: TAssetTab,
  users: userNameId[]
}) {
  const {
    data,
    isCheckTable,
    assetTab,
    tabValue,
    users
  } = props
  const [tablePage, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(startRowsPerPage);
  return (
    <>
      <Table stickyHeader size="small" sx={{
        minWidth: 650,
        border: 'solid',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderWidth: 1,
        borderColor: blue[400],
      }}
        className={tabValue == assetTab ? "" : "hidden"}
      >
        <ListAsset data={data}
          isCheckTable={isCheckTable}
          assetTab={assetTab}
          page={tablePage}
          rowsPerPage={rowsPerPage}
          users={users}
        />
        <TableFooter>
          <TableRow>
            <TablePagination
              showFirstButton
              showLastButton
              rowsPerPageOptions={
                rowsPerPageOptions
              }
              colSpan={5}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={tablePage}
              onPageChange={(event, page) => {
                handleChangePage(event, page, setPage, data.length, rowsPerPage)
              }}
              onRowsPerPageChange={(event) => {
                handleChangeRowsPerPage(
                  event as ChangeEvent<HTMLInputElement>,
                  setRowsPerPage,
                  setPage)
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}