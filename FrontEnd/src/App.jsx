import { Routes, Route } from 'react-router-dom';

import Home from './Pages/HomePage/Home.jsx';
import Login from './Pages/SignIn/SignIn.jsx';
import Signup from './Pages/SignUp/SignUp.jsx';
import ForgotPassword from './Pages/ForgetPassword/ForgotPassword.jsx';
import ResetPassword from './Pages/RestPassword/ResetPassword.jsx';
import RoomsPage from './Pages/RoomsPage/RoomsPage.jsx';
import RoomDetail from './Pages/RoomDetail/RoomDetail.jsx';

function App() {
  return (
    <div className="app-route">
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rooms Pages */}
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />

        {/* 404 Page */}
        <Route path="*" element={<div>404 - Page is under development</div>} />
      </Routes>
    </div>
  );
}

export default App;