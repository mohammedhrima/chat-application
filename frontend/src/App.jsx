import './App.css'
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from './pages/Signup'
import Login from './pages/Login'
import Chat from './pages/Chat'
import SetAvatar from "./components/SetAvatar"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Chat />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/setavatar' element={<SetAvatar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
