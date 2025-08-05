import Loader from '@/components/Loader/Loader'
import { useAuth } from '@/context/authContext'
import { API_URL } from '@/lib/api.env'
import axios from 'axios'
import { ChevronLeft, LucideArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SupportResponse() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState([])
    const {user} = useAuth()

    const fetchMessages = async () => {
        // setLoading(true)
        const response = await axios.get(`${API_URL}/api/support/user/${user.id}`)
        if (response.status === 200) {
            // console.log(response.data.data);
            setUserData(response.data.data)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])
    
    if (loading) {
        return <Loader />
    }

  return (
   <div className="container p-4 mx-auto h-[100dvh] flex flex-col ">
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white ">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer text-black"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-xl font-semibold text-black">Support Response</h2>
        <div className="w-6 h-6" />
    </div>

    {
        userData.length > 0 ? userData.map((items, index) => (
    <div key={index} className="flex flex-col justify-start py-10 px-2 gap-2">
        <div className="w-[95%] h-auto bg-gray-200 rounded-xl relative after:absolute after:w-1 after:h-8 after:bg-neutral-400 after:left-5 after:rounded-full after:-bottom-5 after:-z-10 flex justify-start items-center px-3 py-4">
        <p className='text-sm text-black flex justify-center items-center gap-1'>{items.subject} {items.subSubject && <span className='text-blue-600'><LucideArrowRight size={12}/></span>}{items.subSubject && items.subSubject}</p>
        </div>
        {
            items.relatedId && (
                <div className="w-[95%] h-auto bg-gray-200 rounded-xl relative after:absolute after:w-1 after:h-8 after:bg-neutral-400 after:left-5 after:rounded-full after:-bottom-5 after:-z-10 flex justify-start items-center px-3 py-4">
        <p className='text-sm text-black flex justify-center items-center gap-1'>ID <span className='text-blue-600'><LucideArrowRight size={12}/></span> {items.relatedId}</p>
        </div>
            )
        }
        <div className="w-[95%] h-auto bg-gray-200 rounded-xl relative after:absolute after:w-1 after:h-8 after:bg-neutral-400 after:left-5 after:rounded-full after:-bottom-5 after:-z-10 flex justify-start items-center px-3 py-4">
        <p className='text-sm text-gray-700 flex justify-center items-center gap-1'>{items.message}</p>
        </div>
        {
            items.replyMessage ? (
                <div className="w-[95%] h-auto bg-gray-200 rounded-xl px-3 py-4">
        <p className='text-sm text-gray-700 gap-1'>{items.replyMessage}</p>
                </div>
            ) : (
                             <div className="w-[95%] h-auto bg-gray-200 rounded-xl px-3 py-4">
        <p className='text-sm text-gray-700 gap-1'>Wait for Response</p>
                </div>   
            )
        }

    </div>

        )) : (
            <div className="flex justify-center items-center w-full h-screen">
            <p className='text-base text-gray-500 capitalize'>No Queries has been asked from helpdesk</p>
            </div>
        )
    }

    </div>
  )
}

export default SupportResponse