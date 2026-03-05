// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import AddRoom from "./Pages/Admin/AddRoom";
// import RoomList from "./Pages/Admin/RoomList";
// import UpdateRoom from "./Pages/Admin/UpdateRoom";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/admin/rooms" replace />} />
//         <Route path="/admin/rooms" element={<RoomList />} />
//         <Route path="/admin/rooms/add" element={<AddRoom />} />
//         <Route path="/admin/rooms/edit/:id" element={<UpdateRoom />} />
//         <Route path="*" element={<Navigate to="/admin/rooms" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddRoom from "./Pages/Admin/AddRoom";
import RoomList from "./Pages/Admin/RoomList";
import UpdateRoom from "./Pages/Admin/UpdateRoom";

import FoodList from "./Pages/Admin/ResManage/FoodList";
import AddFood from "./Pages/Admin/ResManage/AddFood";
import UpdateFood from "./Pages/Admin/ResManage/UpdateFood";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/rooms" replace />} />

        {/* Rooms */}
        <Route path="/admin/rooms" element={<RoomList />} />
        <Route path="/admin/rooms/add" element={<AddRoom />} />
        <Route path="/admin/rooms/edit/:id" element={<UpdateRoom />} />

        {/* Menu */}
        <Route path="/admin/menu" element={<FoodList />} />
        <Route path="/admin/menu/add" element={<AddFood />} />
        <Route path="/admin/menu/edit/:id" element={<UpdateFood />} />

        <Route path="*" element={<Navigate to="/admin/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
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
