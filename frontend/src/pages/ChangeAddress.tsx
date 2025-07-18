import ShadeBtn from '@/components/ui/ShadeBtn'
import { API_URL } from '@/lib/api.env'
import axios from 'axios'
import { ChevronLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Input({forWhat, type="text", value, onChangeAction}: {
    forWhat: string,
    value: string | number,
    onChangeAction?: any,
    type?: string
}) {
    return (

        <input
        required
        maxLength={forWhat === "Postal Code" ? 6: 1000}
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
    const params = useParams()
    const address = atob(params.address)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
        name: "",
        phone: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: ""
    })

    const handleClick = async () => {
      if (
        userData.name === "" ||
        userData.area === "" ||
        userData.city === "" ||
        userData.state === "" ||
        userData .landmark === "" ||
        userData.phone === "" ||
        userData.pincode === ""
      ) {
        console.error("all fields are required")
        return
      }

      const final_address = `${userData.name}, ${userData.area}, ${userData.landmark}, ${userData.city}, ${userData.state}, ${userData.pincode}, ${userData.phone}`
      setLoading(true)
      const req = await axios.put(`${API_URL}/api/users/update-auth-user`, {
        address: final_address
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (req.status === 200) {
        setLoading(false)
        navigate(-1)
      }

    }

    const onChangeAction = (key: keyof typeof userData, value: string) => {
    setUserData(prev => ({
        ...prev,
        [key]: value
    }))
}

const setAddressFromString = (input: string) => {
    const parts = input.split(',').map(part => part.trim());

    // console.log(parts)

    setUserData({
        name: parts[0] || "",
        area: parts[1] || "",
        landmark: parts[2] || "",
        city: parts[3] || "",
        phone: parts[6] || "",
        state: parts[4] || "",
        pincode: parts[5] || ""
    })
}


useEffect(() => {
  if (address !== "null") {
    setAddressFromString(address)
  }
}, [])

  return (
    <div className='min-h-screen h-auto w-screen relative mb-10'>
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
        <Input onChangeAction={(value: string) => onChangeAction('name', value)}  value={userData.name} forWhat='Full Name' />
        <Input onChangeAction={(value: string) => onChangeAction('phone', value)} type='number' value={userData.phone} forWhat='Mobile Number'/>
        <Input onChangeAction={(value: string) => onChangeAction('area', value)} value={userData.area} forWhat='Street Area'/>
        <Input onChangeAction={(value: string) => onChangeAction('landmark', value)} value={userData.landmark} forWhat='Landmark'/>
        <Input onChangeAction={(value: string) => onChangeAction('city', value)} value={userData.city} forWhat='City'/>
        <Input onChangeAction={(value: string) => onChangeAction('state', value)} value={userData.state} forWhat='State'/>
        <Input onChangeAction={(value: string) => onChangeAction('pincode', value)} type='number' value={userData.pincode} forWhat='Postal Code'/>
        </div>
      </div>

            <div className="fixed bottom-2 w-full px-4">
        <ShadeBtn title="Change Address" action={() => handleClick()}/>
      </div>
    </div>
  )
}

export default ChangeAddress