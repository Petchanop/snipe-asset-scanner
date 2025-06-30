import { HeadersLocationTable } from "@/_types/interfaces";
import { TAssetRow } from "@/_types/types";

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

export const mockAssetsByLocation : Record<string, TAssetRow[]> = {
  'IT dpt': [
    {
      assetCode: "IT001",
      assetName: "Dell Laptop",
      assignedTo: "John Doe",
      countCheck: true,
      assignIncorrect: false
    },
    {
      assetCode: "IT002",
      assetName: "HP Monitor",
      assignedTo: "Alice Smith",
      countCheck: true,
      assignIncorrect: true
    },
    {
      assetCode: "IT003",
      assetName: "Logitech Keyboard",
      assignedTo: "John Doe",
      countCheck: false,
      assignIncorrect: false
    },
    // ... up to 15 total
  ],

  'HR office': [
    {
      assetCode: "HR001",
      assetName: "MacBook Pro",
      assignedTo: "Karen Holt",
      countCheck: true,
      assignIncorrect: false
    },
    {
      assetCode: "HR002",
      assetName: "Office Chair",
      assignedTo: "Samira Khan",
      countCheck: true,
      assignIncorrect: false
    },
    // ...more
  ],

  'Finance': [
    {
      assetCode: "FIN001",
      assetName: "Canon Scanner",
      assignedTo: "Rick Lee",
      countCheck: true,
      assignIncorrect: false
    },
    {
      assetCode: "FIN002",
      assetName: "Excel License",
      assignedTo: "Ying Zhao",
      countCheck: false,
      assignIncorrect: true
    },
    // ...
  ],

  'Marketing': [
    {
      assetCode: "MKT001",
      assetName: "iPad Pro",
      assignedTo: "Derek Tan",
      countCheck: true,
      assignIncorrect: false
    },
    {
      assetCode: "MKT002",
      assetName: "Sony Camera",
      assignedTo: "Nina Lau",
      countCheck: true,
      assignIncorrect: false
    },
    // ...
  ],

  'Legal': [
    {
      assetCode: "LGL001",
      assetName: "Brother Printer",
      assignedTo: "Charles Moon",
      countCheck: false,
      assignIncorrect: false
    },
    {
      assetCode: "LGL002",
      assetName: "Document Safe",
      assignedTo: "Mary Green",
      countCheck: true,
      assignIncorrect: true
    },
    // ...
  ]
};

export const tableHeaders: HeadersLocationTable[] = [
    {
        label: "Date",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Document No.",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Location",
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