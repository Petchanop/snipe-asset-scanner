'use client'
import { Dayjs } from "dayjs";
import { createContext, Dispatch, RefObject, SetStateAction, useContext } from "react";
import { TReportForm } from "@/_types/types";

export type LocationStateContext = {
  selected: RefObject<string>;
  locationId: number;
  setLocationId: Dispatch<SetStateAction<number>>;
}

export type TRemarkAssetCountLine = {
  id: string;
  remark: string;
}

export type ReportStateContext = {
  DocumentNumber: number | undefined;
  update: boolean;
  remark?: TRemarkAssetCountLine[];
  setDocumentNumber: Dispatch<SetStateAction<number | undefined>>;
  setRefetchReport: Dispatch<SetStateAction<boolean>>;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  setRemark?: Dispatch<SetStateAction<TRemarkAssetCountLine[]>>;
  setSearch:  Dispatch<SetStateAction<boolean>>;
}

export type TDateValueContext = {
  dateValue: Dayjs;
  setDateValue: Dispatch<SetStateAction<Dayjs | null>>
}

export type hiddenCellContextType = {
  isHidden: boolean;
  setIsHidden: Dispatch<SetStateAction<boolean>>;
}

export type TCreateReportContext = {
  report: TReportForm,
  setReport: Dispatch<SetStateAction<TReportForm>>
}

export const CreateReportContext = createContext<TCreateReportContext | null>(null);
export const LocationUrlContext = createContext<LocationStateContext | null>(null);
export const ReportContext = createContext<ReportStateContext | null>(null);
export const DateValueContext = createContext<TDateValueContext | null>(null)
export const HiddenCellContext = createContext<hiddenCellContextType | null>(null)

export function useCreateReportContext() {
  const context = useContext(CreateReportContext)
  if (!context) {
    throw new Error("useCreateReportContext must be use within Context provider")
  }
  return context
}

export function useLocationUrlContext() {
  const context = useContext(LocationUrlContext)
  if (!context) {
    throw new Error("useLocatoinUrlContext must be use within Context provider")
  }
  return context
}

export function useReportContext() {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error("useReportContext must be use within Context provider")
  }
  return context
}

export function useDateContext() {
  const context = useContext(DateValueContext)
  if (!context) {
    throw new Error("useLocatoinUrlContext must be use within Context provider")
  }
  return context
}

export function useHiddenCellContext() {
  const context = useContext(HiddenCellContext);
  if (!context) {
    throw new Error("useHiddenCellContext must be used within a HiddenCellProvider");
  }
  return context;
}