import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

const AdminLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axiosInstance.post("/admin/login", {
      email,
      password,
    });

    localStorage.setItem("adminToken", res.data.token);
    window.location.href = "/dashboard"; // redirect to admin dashboard
  } catch (error: any) {
    alert(error.response?.data?.message || "Invalid admin credentials");
  }
};


  return (
    <form onSubmit={handleLogin}>
      <h2>NutriScan Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default AdminLogin;
