import { Navigate, Route, Routes } from "react-router-dom";
import Signin from "../pages/Signin";
import Main from "../pages/Main";
import Signup from "../pages/Signup";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/main" element={<Main />} />
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
