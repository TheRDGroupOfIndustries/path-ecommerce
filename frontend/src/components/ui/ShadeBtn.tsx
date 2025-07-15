import React from 'react'

function ShadeBtn({title, action}: {
    title: string,
    action: any
}) {
  return (
    <button onClick={action} className='w-full py-4 rounded-xl px-6 text-center bg-blue-900/25'>
        <p className='text-lg text-blue-900 font-medium'>{title}</p>
    </button>
  )
}

export default ShadeBtn