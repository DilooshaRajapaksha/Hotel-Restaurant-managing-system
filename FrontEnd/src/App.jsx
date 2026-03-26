import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/HomePage/Home.jsx';
import Login from './Pages/SignIn/SignIn.jsx';
import Signup from './Pages/SignUp/SignUp.jsx';
import ForgotPassword from './Pages/ForgetPassword/ForgotPassword.jsx';
import ResetPassword from './Pages/RestPassword/ResetPassword.jsx';

function App() {
  return (
    <div className="app-route">
      <Routes>
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<div>404 - Page is under development</div>} />
      </Routes>
    </div>
  );
}

export default App;
