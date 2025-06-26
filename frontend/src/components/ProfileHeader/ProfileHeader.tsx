import { Search } from 'lucide-react'
import React from 'react'

const ProfileHeader = () => {
  return (
    <div>
  
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="https://picsum.photos/id/64/200/200"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="leading-tight">
            <p className="text-sm text-muted-foreground">Hey,</p>
            <p className="text-lg font-semibold text-black">Adarsh</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
          <Search size={20} />
        </div>
      </div>

      <div className="relative w-2/3 mt-4">
        <div className="w-full h-0.5 bg-black relative">
          <div className="w-3 h-3 bg-black rounded-full absolute -bottom-1 -right-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
