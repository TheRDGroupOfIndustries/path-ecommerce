import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const SendEnquire = ({setShowPopup}) => {
  return (
     <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 "  onClick={() => setShowPopup(false)}>
          <div className=" [background:radial-gradient(circle_at_center,_#0a1b57_0%,_#000_60%)] text-white w-full max-w-md rounded-t-4xl p-6 h-[65vh] overflow-auto animate-slide-up flex flex-col"
          onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">Hey!</h2>
              
            </div>

            <p className="mb-4 text-lg font-light">
              Feel Free to ask anything about Marketplace name!
            </p>

           
            <div className="flex flex-col gap-2 mb-4">
              <Input
                type="text"
                placeholder="Full name"
                className="w-full p-2 bg-transparent text-white rounded border-none"
              />
              <Input
                type="email"
                placeholder="Your email"
                className="w-full p-2 bg-transparent text-white rounded border-none"
              />
              <Input
                type="text"
                placeholder="Subject"
                className="w-full p-2 bg-transparent text-white rounded border-none"
              />
              <Textarea
                placeholder="Your message..."
                className="w-full p-2 bg-transparent text-white rounded h-20 border-none"
              />
            </div>

            <Button className="w-full bg-white text-black py-2 rounded-2xl border-none mt-auto hover:text-white">
              Send Enquiry
            </Button>
          </div>
        </div>
  )
}

export default SendEnquire