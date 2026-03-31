import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import RoomList      from "./Pages/Admin/RoomList";
import AddRoom       from "./Pages/Admin/AddRoom";
import UpdateRoom    from "./Pages/Admin/UpdateRoom";

import BookingList   from "./Pages/Admin/BookingList";

import AdminDashboard from "./Pages/Admin/AdminDashboard";

import DeliveryStaffPage from "./Pages/Delivery/DeliveryStaffPage";
import AssignOrdersPage  from "./Pages/Delivery/AssignOrdersPage";

export default function App() {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Navigate to="/admin/rooms" replace />} />

        <Route path="/admin/rooms"          element={<RoomList />} />
        <Route path="/admin/rooms/add"      element={<AddRoom />} />
        <Route path="/admin/rooms/edit/:id" element={<UpdateRoom />} />

        <Route path="/admin/bookings"       element={<BookingList />} />

        <Route path="/admin/reports"        element={<AdminDashboard />} />

        <Route path="/delivery/staff"  element={<DeliveryStaffPage />} />
        <Route path="/delivery/orders" element={<AssignOrdersPage />} />

        <Route path="*" element={<Navigate to="/admin/rooms" replace />} />

      </Routes>
    </Router>
  );
}