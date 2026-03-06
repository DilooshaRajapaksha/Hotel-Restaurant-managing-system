import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import RoomsPage from "./Pages/RoomsPage/RoomsPage";
import RoomDetail from "./Pages/RoomDetail/RoomDetail";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;