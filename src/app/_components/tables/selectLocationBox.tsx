'use client'
import { useLocationUrlContext } from "@/_contexts/context"
import { TLocation } from "@/_types/snipe-it.type"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import { decode } from "html-entities"
import { Location } from "@/_types/types"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"

export function ChildrenSelectComponent(props: {
  parent: TLocation,
  locationByParent: TLocation[],
  childId: number,
  isCheckTable?: boolean,
  setChildId: (value: number) => void
  className?: string,
}) {
  const { parent, locationByParent, childId, setChildId, isCheckTable, className } = props
  const childLocation = useRef("")
  const [childrenLocation, setChildrenLocation] = useState<TLocation[]>([])
  const context = useLocationUrlContext()
  const handleOnClick = (target: EventTarget
    & (HTMLInputElement | HTMLTextAreaElement)) => {
    const locationByName = childrenLocation.filter((loc) => loc.name == target.value)[0] as unknown as Location
    setChildId(locationByName.id)
    childLocation.current = target.value
    context.setLocationId(locationByName.id)
  }

  const childrenLocationChange = useMemo(() => {
    return locationByParent.filter((loc) =>
      //@ts-expect-error some use parent_id some parent.id
      loc.parent_id === parent?.id || loc.parent?.id == parent?.id
    )
  }, [parent, locationByParent])

  useEffect(() => {
    const setDefaultValue = () => {
      let defaultValue = childrenLocationChange.find((loc) => loc.id == childId)
      let locationId = childId as unknown as number
      if (!defaultValue) {
        defaultValue = childrenLocationChange[0]
        locationId = childrenLocationChange[0]?.id!
      }

      if (!locationId)
        locationId = parent?.id as unknown as number
      context.setLocationId(locationId)
      setChildId(locationId)
      childLocation.current = defaultValue?.name! as string
    }
    setChildrenLocation(childrenLocationChange)
    setDefaultValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenLocationChange])

  return (
    <>
      {
        childrenLocation.length && parent ?
          <TextField
            select
            label="sub location"
            name={parent?.name}
            value={childLocation.current}
            className={className ? className : "mt-3 p-4 w-full max-md:w-70"}
            onChange={(event) => handleOnClick(event.target)}
            disabled={isCheckTable}
          >
            {
              childrenLocation.map((loc) =>
                <MenuItem value={loc.name as unknown as string} key={loc.id}>
                  {decode(loc.name)}
                </MenuItem>
              )
            }
          </TextField>
          : <div className="lg:p-4 mt-3 lg:w-3/5"></div>
      }
    </>
  )
}

export function ParentSelectComponent(props: {
  parentLocation: TLocation[],
  parentProp: TLocation,
  isCheckTable?: boolean,
  className?: string,
  setParent: (location: TLocation) => void,
}) {
  const { parentLocation, parentProp, setParent, isCheckTable, className } = props
  return (
    <TextField
      select
      label="location"
      value={parentProp ? parentProp.name : parentLocation[0]!.name! as string}
      className={className ? className: "mt-3 p-4 w-full max-md:w-70"}
      disabled={isCheckTable}
      onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newParent = parentLocation.find((loc) => loc.name == event.target.value);
        setParent(newParent!)
      }}
      >
      {
        parentLocation ?
          parentLocation.map((loc) =>
            <MenuItem value={loc.name} key={loc.id}>{decode(loc.name)}</MenuItem>
          )
          : <></>
      }
    </TextField>
  )
}