import { useAuth } from "../../context/AuthContext.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminLayout from "./AdminLayout.jsx";

export default function Admin() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <AdminLayout /> : <AdminLogin />;
}
