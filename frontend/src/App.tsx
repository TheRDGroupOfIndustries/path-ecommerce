import { Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/authContext"
import Login from "./Auth/Signup"
import SignUp from "./Auth/Login"


function App() {

  return (
    <AuthProvider>
      
    <div className='text-3xl text-gray-500'>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </div>
    </AuthProvider>
  )
}

export default App
