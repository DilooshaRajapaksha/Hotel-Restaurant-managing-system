// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

/* PUBLIC / CUSTOMER PAGES */
import Home from "./Pages/HomePage/Home";
import RoomsPage from "./Pages/RoomsPage/RoomsPage";
import RoomDetail from "./Pages/RoomDetail/RoomDetail";
import Contact from "./Pages/Contact/Contact";

/* AUTH */
import SignIn from "./Pages/SignIn/SignIn";
import Signup from "./Pages/SignUp/SignUp";
import ForgotPassword from "./Pages/ForgetPassword/ForgotPassword";
import ResetPassword from "./Pages/RestPassword/ResetPassword";

/* ADMIN */
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import RoomList from "./Pages/Admin/RoomList";
import AddRoom from "./Pages/Admin/AddRoom";
import UpdateRoom from "./Pages/Admin/UpdateRoom";


import FoodList from "./Pages/Admin/ResManage/FoodList";
import AddFood from "./Pages/Admin/ResManage/AddFood";
import UpdateFood from "./Pages/Admin/ResManage/UpdateFood";
import AddCategory from "./Pages/Admin/ResManage/AddCategory";
import UpdateCategory from "./Pages/Admin/ResManage/UpdateCategory";

import OrderList from "./Pages/Admin/OrderManage/OrderList";
import OrderDetails from "./Pages/Admin/OrderManage/OrderDetails";

import BookingList from "./Pages/Admin/BookingList";

/* DELIVERY */
import DeliveryStaffPage from "./Pages/Delivery/DeliveryStaffPage";
import AssignOrdersPage from "./Pages/Delivery/AssignOrdersPage";
import StaffProfilePage from "./Pages/Delivery/StaffProfilePage";

/* DELIVERY DASHBOARDS */
const DeliveryDashboard = () => (
  <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
    🚚 Delivery Dashboard
  </div>
);

/* ADMIN DASHBOARDS */
const ReportsPlaceholder = () => (
  <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
    📊 Admin Reports (coming soon)
  </div>
);

function App() {
  return (
    <Router>          
      <AuthProvider>  
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* AUTH */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ADMIN */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/rooms" element={<ProtectedRoute requiredRole="ADMIN"><RoomList /></ProtectedRoute>} />
          <Route path="/admin/rooms/add" element={<ProtectedRoute requiredRole="ADMIN"><AddRoom /></ProtectedRoute>} />
          <Route path="/admin/rooms/edit/:id" element={<ProtectedRoute requiredRole="ADMIN"><UpdateRoom /></ProtectedRoute>} />

          {/* RESTAURANT MENU */}
          <Route path="/admin/menu" element={<ProtectedRoute requiredRole="ADMIN"><FoodList /></ProtectedRoute>} />
          <Route path="/admin/menu/add" element={<ProtectedRoute requiredRole="ADMIN"><AddFood /></ProtectedRoute>} />
          <Route path="/admin/menu/edit/:id" element={<ProtectedRoute requiredRole="ADMIN"><UpdateFood /></ProtectedRoute>} />
          <Route path="/admin/menu/add-category" element={<ProtectedRoute requiredRole="ADMIN"><AddCategory /></ProtectedRoute>} />
          <Route path="/admin/menu/categories/edit/:id" element={<ProtectedRoute requiredRole="ADMIN"><UpdateCategory /></ProtectedRoute>} />

          {/* ORDERS */}
          <Route path="/admin/orders" element={<ProtectedRoute requiredRole="ADMIN"><OrderList /></ProtectedRoute>} />
          <Route path="/admin/orders/:id" element={<ProtectedRoute requiredRole="ADMIN"><OrderDetails /></ProtectedRoute>} />

          {/* BOOKINGS */}
          <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="ADMIN"><BookingList /></ProtectedRoute>} />

          {/* REPORTS */}
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="ADMIN"><ReportsPlaceholder /></ProtectedRoute>} />

          {/* DELIVERY */}
          <Route path="/delivery" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryDashboard /></ProtectedRoute>} />
          <Route path="/delivery/staff" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryStaffPage /></ProtectedRoute>} />
          <Route path="/delivery/staff/:id" element={<ProtectedRoute requiredRole="DELIVERY"><StaffProfilePage /></ProtectedRoute>} />
          <Route path="/delivery/orders" element={<ProtectedRoute requiredRole="DELIVERY"><AssignOrdersPage /></ProtectedRoute>} />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;









