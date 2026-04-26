import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';
import { NotificationProvider } from './Context/NotificationContext';
import ProtectedRoute from './Components/ProtectedRoute';

// Public / Customer pages
import Home          from './Pages/HomePage/Home';
import RoomsPage     from './Pages/RoomsPage/RoomsPage';
import SignIn        from './Pages/SignIn/SignIn';
import Signup        from './Pages/SignUp/SignUp';
import ForgotPassword from './Pages/ForgetPassword/ForgotPassword';
import ResetPassword  from './Pages/RestPassword/ResetPassword';
import Contact       from './Pages/Contact/Contact';
import MenuPage      from './Pages/MenuPage';
import MenuHomePage  from './Pages/MenuHomePage';
import DishDetailsPage from './Pages/DishDetailsPage';
import CartPage      from './Pages/CartPage';
import CheckoutPage  from './Pages/CheckoutPage';
import Profile       from './Pages/Profile/Profile';
import MyOrdersPage  from './Pages/MyOrdersPage';
import OrderTrackingPage from './Pages/OrderTrackingPage';
import RoomDetail    from './Pages/RoomDetail/RoomDetail';

// Admin pages
import AdminDashboard  from './Pages/Admin/AdminDashboard';
import RoomList        from './Pages/Admin/RoomList';
import AddRoom         from './Pages/Admin/AddRoom';
import UpdateRoom      from './Pages/Admin/UpdateRoom';
import FoodList        from './Pages/Admin/ResManage/FoodList';
import AddFood         from './Pages/Admin/ResManage/AddFood';
import UpdateFood      from './Pages/Admin/ResManage/UpdateFood';
import AddCategory     from './Pages/Admin/ResManage/AddCategory';
import UpdateCategory  from './Pages/Admin/ResManage/UpdateCategory';
import OrderList       from './Pages/Admin/OrderManage/OrderList';
import OrderDetails    from './Pages/Admin/OrderManage/OrderDetails';
import BookingList     from './Pages/Admin/BookingList';
import AdminExperiences from './Pages/Admin/AdminExperiences';
import AdminDeliveryStaffPage from './Pages/Admin/AdminDeliveryStaffPage';
import AdminStaffProfilePage  from './Pages/Admin/AdminStaffProfilePage';
import AdminAssignOrdersPage  from './Pages/Admin/AdminAssignOrdersPage';

// ── Delivery staff pages (self-service portal, NOT admin functions) ────────────
import DeliveryDashboard          from './Pages/Delivery/DeliveryDashboard';
import DeliveryAvailableOrdersPage from './Pages/Delivery/DeliveryAvailableOrdersPage';
import DeliveryMyOrdersPage        from './Pages/Delivery/DeliveryMyOrdersPage';

// Notification Toast — shown on every admin page
import NotificationToast from './Components/Admin/NotificationToast';
import { useNotifications } from './Context/NotificationContext';

function AdminToast() {
  const { toast, dismissToast } = useNotifications();
  return <NotificationToast toast={toast} onDismiss={dismissToast} />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>

          {/* ── PUBLIC ROUTES ────────────────────────────────────────── */}
          <Route path="/"                element={<Home />} />
          <Route path="/rooms"           element={<RoomsPage />} />
          <Route path="/rooms/:id"       element={<RoomDetail />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/menu"            element={<MenuHomePage />} />
          <Route path="/menu/list"       element={<MenuPage />} />
          <Route path="/menu/:id"        element={<DishDetailsPage />} />
          <Route path="/cart"            element={<CartPage />} />
          <Route path="/checkout"        element={<CheckoutPage />} />
          <Route path="/profile"         element={<Profile />} />
          <Route path="/my-orders"       element={<MyOrdersPage />} />
          <Route path="/order-tracking"  element={<OrderTrackingPage />} />
          <Route path="/signin"          element={<SignIn />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/experiences"     element={<AdminExperiences />} />
          <Route path="/experiences/all" element={<AdminExperiences />} />

          {/* ── ADMIN ROUTES ─────────────────────────────────────────── */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <NotificationProvider>
                  <AdminToast />
                  <Routes>
                    <Route path="/"                        element={<AdminDashboard />} />
                    <Route path="/rooms"                   element={<RoomList />} />
                    <Route path="/rooms/add"               element={<AddRoom />} />
                    <Route path="/rooms/edit/:id"          element={<UpdateRoom />} />
                    <Route path="/menu"                    element={<FoodList />} />
                    <Route path="/menu/add"                element={<AddFood />} />
                    <Route path="/menu/edit/:id"           element={<UpdateFood />} />
                    <Route path="/menu/add-category"       element={<AddCategory />} />
                    <Route path="/menu/categories/edit/:id" element={<UpdateCategory />} />
                    <Route path="/orders"                  element={<OrderList />} />
                    <Route path="/orders/:id"              element={<OrderDetails />} />
                    <Route path="/bookings"                element={<BookingList />} />
                    <Route path="/reports"                 element={<AdminDashboard />} />
                    <Route path="/experiences"             element={<AdminExperiences />} />

                    {/* Admin delivery management */}
                    <Route path="/delivery/staff"          element={<AdminDeliveryStaffPage />} />
                    <Route path="/delivery/staff/:id"      element={<AdminStaffProfilePage />} />
                    <Route path="/delivery/orders"         element={<AdminAssignOrdersPage />} />
                  </Routes>
                </NotificationProvider>
              </ProtectedRoute>
            }
          />

          {/* ── DELIVERY STAFF ROUTES ────────────────────────────────── */}
          {/*
            Delivery persons only see their own self-service portal:
            - Dashboard    : their profile + stats + active orders preview
            - Available    : unassigned orders they can self-assign
            - My Orders    : their assigned orders + status update + Google Maps
            - History      : same My Orders page on history tab

            Admin functions (add staff, assign to others, view all staff)
            are ONLY accessible via /admin/delivery/*, never here.
          */}
          <Route
            path="/delivery/*"
            element={
              <ProtectedRoute requiredRole="DELIVERY_STAFF">
                <Routes>
                  <Route path="/"          element={<DeliveryDashboard />} />
                  <Route path="/available" element={<DeliveryAvailableOrdersPage />} />
                  <Route path="/my-orders" element={<DeliveryMyOrdersPage />} />
                  {/* /history is the same page but starts on history tab */}
                  <Route path="/history"   element={<DeliveryMyOrdersPage defaultTab="history" />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
