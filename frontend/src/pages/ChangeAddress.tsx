import ShadeBtn from '@/components/ui/ShadeBtn'
import { ChevronLeft } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Input({forWhat, type="text", value, onChangeAction}: {
    forWhat: string,
    value: string | number,
    onChangeAction?: any,
    type?: string
}) {
    return (

        <input
        required
        maxLength={forWhat === "Postal Code" && 6}
        type={type}
        className="w-full py-5 px-4 rounded-xl outline-none border-none text-sm bg-gray-200 text-neutral-700"
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        placeholder={`${forWhat}`}
        />
    )
}


function ChangeAddress() {
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        name: "",
        phone: "",
        area: "",
        landmark: "",
        city: "",
        pincode: ""
    })
  return (
    <div className='min-h-screen h-auto w-screen relative'>
              <div className="flex items-center justify-center gap-0 h-14  text-black mb-2 px-6 border-2 border-neutral-200">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-2xl font-sans text-center font-semibold">
          Change Address
        </h2>
      </div>

            <div className="px-4 py-2 pb-6">
        <h2 className="text-2xl font-bold text-black font-sans mb-6">
          Current Address
        </h2>
        <div className="flex flex-col justify-start gap-5">
        <Input value={userData.name} forWhat='Full Name' />
        <Input type='number' value={userData.phone} forWhat='Mobile Number'/>
        <Input value={userData.area} forWhat='Street Area'/>
        <Input value={userData.landmark} forWhat='Landmark'/>
        <Input value={userData.city} forWhat='City'/>
        <Input type='number' value={userData.pincode} forWhat='Postal Code'/>
        </div>
      </div>

            <div className="fixed bottom-4 w-full px-4">
        <ShadeBtn title="Change Address" action={""}/>
      </div>
    </div>
  )
}

export default ChangeAddress