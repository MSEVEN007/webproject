import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // if applicable

    // Redirect to login page
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Logging out...</h2>
    </div>
  );
}
