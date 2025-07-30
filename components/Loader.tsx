import { LoaderIcon } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center'>
      <div className='h-10 w-10 relative animate-spin'>
        <LoaderIcon />
      </div>
      <p className='text-sm text-muted-foreground'>
        Thinking...
      </p>
    </div>
  )
}

export default Loader
