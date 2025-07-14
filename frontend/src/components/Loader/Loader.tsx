import React from 'react'

function Loader() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
<div className="flex flex-row gap-2">
  <div className="w-4 h-4 rounded-full primary-bg animate-bounce"></div>
  <div className="w-4 h-4 rounded-full primary-bg animate-bounce [animation-delay:-.3s]"></div>
  <div className="w-4 h-4 rounded-full primary-bg animate-bounce [animation-delay:-.5s]"></div>
</div>
    </div>
  )
}

export default Loader