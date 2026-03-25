import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Room Management
import RoomList      from "./Pages/Admin/RoomList";
import AddRoom       from "./Pages/Admin/AddRoom";
import UpdateRoom    from "./Pages/Admin/UpdateRoom";

// Bookings
import BookingList   from "./Pages/Admin/BookingList";

// Reports Dashboard
import AdminDashboard from "./Pages/Admin/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/rooms" replace />} />

        {/* Room Management */}
        <Route path="/admin/rooms"          element={<RoomList />} />
        <Route path="/admin/rooms/add"      element={<AddRoom />} />
        <Route path="/admin/rooms/edit/:id" element={<UpdateRoom />} />

        {/* Bookings */}
        <Route path="/admin/bookings"       element={<BookingList />} />

        {/* Reports Dashboard */}
        <Route path="/admin/reports"        element={<AdminDashboard />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/admin/rooms" replace />} />
      </Routes>
    </Router>
  );
}
