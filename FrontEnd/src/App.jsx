// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';



// Admin pages (self-contained with AdminSidebar)
import AdminDashboard from './Pages/Admin/AdminDashboard';   // or wherever it lives
import RoomList from './Pages/Admin/RoomList';
import AddRoom from './Pages/Admin/AddRoom';
import UpdateRoom from './Pages/Admin/UpdateRoom';
import FoodList from './Pages/Admin/ResManage/FoodList';
import AddFood from './Pages/Admin/ResManage/AddFood';
import UpdateFood from './Pages/Admin/ResManage/UpdateFood';
import AddCategory from './Pages/Admin/ResManage/AddCategory';
import UpdateCategory from './Pages/Admin/ResManage/UpdateCategory';
import OrderList from './Pages/Admin/OrderManage/OrderList';
import OrderDetails from './Pages/Admin/OrderManage/OrderDetails';
import BookingList from './Pages/Admin/BookingList';
import RoomDetail from './Pages/RoomDetail/RoomDetail';

// Delivery placeholder (create later)
const DeliveryDashboard = () => <div style={{ padding: 40, textAlign: 'center', fontSize: 18 }}>🚚 Delivery Staff Dashboard (coming soon)</div>;

<<<<<<< HEAD
import OrderList from "./Pages/Admin/OrderManage/OrderList";
import OrderDetails from "./Pages/Admin/OrderManage/OrderDetails";

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
        <Route path="/admin/menu/add-category" element={<AddCategory />} />
        <Route path="/admin/menu/edit/:id" element={<UpdateFood />} />
        <Route path="/admin/menu/categories/edit/:id" element={<UpdateCategory />} />


        {/* Orders */}
        <Route path="/admin/orders" element={<OrderList />} />
        <Route path="/admin/orders/:id" element={<OrderDetails />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/admin/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
=======
function App() {
  return (
    <AuthProvider>
      
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/contact" element={<Contact />} />

          

          {/* ADMIN ROUTES – protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={<ProtectedRoute requiredRole="ADMIN"><RoomList /></ProtectedRoute>}
          />
          <Route
            path="/admin/rooms/add"
            element={<ProtectedRoute requiredRole="ADMIN"><AddRoom /></ProtectedRoute>}
          />
          <Route
            path="/admin/rooms/edit/:id"
            element={<ProtectedRoute requiredRole="ADMIN"><UpdateRoom /></ProtectedRoute>}
          />

          <Route
            path="/admin/menu"
            element={<ProtectedRoute requiredRole="ADMIN"><FoodList /></ProtectedRoute>}
          />
          <Route
            path="/admin/menu/add"
            element={<ProtectedRoute requiredRole="ADMIN"><AddFood /></ProtectedRoute>}
          />
          <Route
            path="/admin/menu/edit/:id"
            element={<ProtectedRoute requiredRole="ADMIN"><UpdateFood /></ProtectedRoute>}
          />
          <Route
            path="/admin/menu/add-category"
            element={<ProtectedRoute requiredRole="ADMIN"><AddCategory /></ProtectedRoute>}
          />
          <Route
            path="/admin/menu/categories/edit/:id"
            element={<ProtectedRoute requiredRole="ADMIN"><UpdateCategory /></ProtectedRoute>}
          />

          <Route
            path="/admin/orders"
            element={<ProtectedRoute requiredRole="ADMIN"><OrderList /></ProtectedRoute>}
          />
          <Route
            path="/admin/orders/:id"
            element={<ProtectedRoute requiredRole="ADMIN"><OrderDetails /></ProtectedRoute>}
          />

          <Route
            path="/admin/bookings"
            element={<ProtectedRoute requiredRole="ADMIN"><BookingList /></ProtectedRoute>}
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <div style={{ padding: 40, textAlign: 'center', fontSize: 18 }}>📊 Admin Reports (coming soon)</div>
              </ProtectedRoute>
            }
          />

          {/* DELIVERY ROUTE (placeholder) */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute requiredRole="DELIVERY">
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      
    </AuthProvider>
  );
}

export default App;
>>>>>>> 8d7205ddee1ea0e38abb214c190a93bb900b996d
