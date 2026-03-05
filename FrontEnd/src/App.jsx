import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './Pages/HomePage/Home.jsx'
import Login from './Pages/SignIn/SignIn.jsx'
import Signup from './Pages/SignUp/SignUp.jsx'
  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<div>404 - Page is under development</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App 