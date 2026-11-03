
import { useState } from "react";
import API from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer"
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Registration successful!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p>Join AgriHistory and preserve your farming history.</p>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="farmer">Farmer</option>
          <option value="visitor">Visitor</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Register;
