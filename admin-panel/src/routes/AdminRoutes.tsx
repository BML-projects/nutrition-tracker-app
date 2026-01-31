import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import Dashboard from "../pages/dashboard/Dashboard";

const AdminRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
