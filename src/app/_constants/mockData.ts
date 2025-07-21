import { HeadersLocationTable } from "@/_types/interfaces";

export const mockLocationTableData = [
  {
    "date": "01/06/2025",
    "documentNumber": "AC200256",
    "location": "IT dpt",
    "status": "IN PROGRESS",
    "action": "OPEN"
  },
  {
    "date": "01/06/2025",
    "documentNumber": "HR102579",
    "location": "HR office",
    "status": "NEW",
    "action": "VIEW"
  },
  {
    "date": "01/06/2025",
    "documentNumber": "FN308901",
    "location": "Finance",
    "status": "COMPLETED",
    "action": "OPEN"
  },
  {
    "date": "01/06/2025",
    "documentNumber": "MK403228",
    "location": "Marketing",
    "status": "CANCEL",
    "action": "VIEW"
  },
  {
    "date": "02/06/2025",
    "documentNumber": "AC300789",
    "location": "IT dpt",
    "status": "NEW",
    "action": "OPEN"
  },
  {
    "date": "01/06/2025",
    "documentNumber": "LG120011",
    "location": "Legal",
    "status": "IN PROGRESS",
    "action": "VIEW"
  },
  {
    "date": "01/06/2025",
    "documentNumber": "FN909007",
    "location": "Finance",
    "status": "COMPLETED",
    "action": "OPEN"
  },
  {
    "date": "01/06/2025",
    "documentNumber": "MK777201",
    "location": "Marketing",
    "status": "CANCEL",
    "action": "OPEN"
  },
  {
    "date": "03/06/2025",
    "documentNumber": "AC111115",
    "location": "IT dpt",
    "status": "IN PROGRESS",
    "action": "VIEW"
  },
  {
    "date": "02/06/2025",
    "documentNumber": "HR552234",
    "location": "HR office",
    "status": "NEW",
    "action": "OPEN"
  }
]

export const mockLocation = [
  'IT dpt', 'HR office', 'Finance', 'Marketing', 'Legal'
]

export const tableHeaders: HeadersLocationTable[] = [
  {
    label: "Document No.",
    isSelectBox: false,
    fontColor: ["black"]
  },
  {
    label: "ชื่อแผน",
    isSelectBox: false,
    fontColor: ["black"]
  },
    {
    label: "วันที่ตรวจนับ",
    isSelectBox: false,
    fontColor: ["black"]
  },
  {
    label: "Status",
    isSelectBox: true,
    fontColor: ["blue", "yellow", "green", "red"]
  },
  {
    label: "Actions",
    isSelectBox: true,
    fontColor: ["black"]
  }
]