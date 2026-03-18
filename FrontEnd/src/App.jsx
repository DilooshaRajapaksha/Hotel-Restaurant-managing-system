import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddRoom from "./Pages/Admin/AddRoom";
import RoomList from "./Pages/Admin/RoomList";
import UpdateRoom from "./Pages/Admin/UpdateRoom";

import FoodList from "./Pages/Admin/ResManage/FoodList";
import AddFood from "./Pages/Admin/ResManage/AddFood";
import AddCategory from "./Pages/Admin/ResManage/AddCategory";
import UpdateFood from "./Pages/Admin/ResManage/UpdateFood";
import UpdateCategory from "./Pages/Admin/ResManage/UpdateCategory";


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