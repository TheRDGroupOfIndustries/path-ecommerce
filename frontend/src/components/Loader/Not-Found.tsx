import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const router = useNavigate()
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
        <h1 className='text-5xl text-black font-black font-sans'>OOPS!</h1>
        <h1 className='text-6xl text-neutral-400 font-black font-sans'>You're Lost!</h1>
        <Button className='rounded-full my-4' onClick={() => router(`/`)}>Go Back To Home</Button>

    </div>
  )
}

export default NotFound