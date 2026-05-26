import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { apiFetch, setToken } from "../lib/api";
import "./Admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToken(data.token);
      navigate("/admin");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-shell admin-login-shell">
      <form className="admin-card admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-icon">
          <Lock size={24} />
        </div>
        <h2>Admin Login</h2>
        <p>Access the portfolio control panel.</p>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Enter email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Enter password"
            required
          />
        </label>

        <button className="admin-primary" style={{ marginTop: "10px" }} type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {status && <div className="admin-status error">{status}</div>}
      </form>
    </section>
  );
}
