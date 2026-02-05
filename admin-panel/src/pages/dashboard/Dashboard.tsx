import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        setData(res.data.message);
      } catch (err) {
        console.error(err);
        navigate("/login"); // redirect if not authorized
      }
    };
    fetchDashboard();
  }, []);

  return <div>{data}</div>;
};

export default Dashboard;
