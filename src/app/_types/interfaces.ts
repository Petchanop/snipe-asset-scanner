import { AssetCount, AssetCountLine, AssetCountLocation, TAssetRow } from "@/_types/types";

export interface HeadersLocationTable {
    label: string;
    isSelectBox: boolean;
    fontColor: string[];
    value: keyof AssetCount & "action" & string; 
}

export interface HeadersAssetTable {
    label: string,
    isSelectBox: boolean,
    fontColor: string[],
    value: keyof TAssetRow,
    mobile?: boolean
}

export interface AssignedTo {
  id: string;
  first_name: string;
  last_name: string;
}

export interface AssetFormData {
  id: string;
  assetCode: string;
  assetName: string;
  assignedTo: AssignedTo;
  countCheck: boolean;
  assignIncorrect: boolean;
}

export interface AssetCountWithAssetLocation extends AssetCount {
  AssetCountLocation: AssetCountLocation[]
}

export interface AssetCountWithLineAndLocation extends AssetCountWithAssetLocation {
  AssetCountLine:  AssetCountLine[]
}