import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddRoom from "./Pages/Admin/AddRoom";
import RoomList from "./Pages/Admin/RoomList";
import UpdateRoom from "./Pages/Admin/UpdateRoom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/rooms" replace />} />
        <Route path="/admin/rooms" element={<RoomList />} />
        <Route path="/admin/rooms/add" element={<AddRoom />} />
        <Route path="/admin/rooms/edit/:id" element={<UpdateRoom />} />
        <Route path="*" element={<Navigate to="/admin/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  );
}