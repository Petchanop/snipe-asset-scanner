import Skeleton from "@mui/material/Skeleton";

export function LoadingSkeleton(){
  return (
    <Skeleton className='w-screen h-screen lg:w-4/6 lg:h-3/4 absolute lg:top-22' />
  )
}