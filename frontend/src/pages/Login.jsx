import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Wallet } from "lucide-react";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    return /^[^s@]+@[^s@]+.[^s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && !formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const url = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const payload = isRegister
        ? {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }
        : {
            email: formData.email.trim(),
            password: formData.password,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (isRegister) {
        setIsRegister(false);
        setFormData({ name: "", email: "", password: "" });
        setError("");
        alert("Registration successful! Please login.");
        return;
      }

      const loggedInUser = data.user;
      const userProfiles = data.profiles; // ✅ Backend se profiles

      if (!loggedInUser) {
        setError("User data not found");
        return;
      }

     const defaultProfile = userProfiles?.find(
  (p) => p.email === loggedInUser.email
) || userProfiles?.[0];

console.log("Default profile:", defaultProfile); // Debug

const activeData = {
  _id: loggedInUser._id,
  profileName: defaultProfile?.profileName || loggedInUser.name || "User",
  email: loggedInUser.email || "",
  profileId: defaultProfile?._id, // ✅ Tara ka = 69ff0ee1c5ffbee00dacc122
};

console.log("Active data set:", activeData); // Debug

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("userEmail", loggedInUser.email || "");
      localStorage.setItem(
        "userName",
        loggedInUser.name || loggedInUser.email?.split("@")[0] || "User"
      );
      localStorage.setItem("profiles", JSON.stringify(userProfiles || []));
      localStorage.setItem("activeProfile", JSON.stringify(activeData));

      setFormData({ name: "", email: "", password: "" });
      window.location.href = "/";
    } catch (err) {
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-badge">
          <Wallet size={20} />
          <span>SplitEase</span>
        </div>

        <h1>{isRegister ? "Create Account" : "Welcome Back"}</h1>

        <p className="auth-subtitle">
          {isRegister
            ? "Register to manage your groups, expenses and notes."
            : "Login to manage your groups, expenses and notes."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="input-group">
              <label>Name</label>
              <div className="input-wrap">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <div className="input-wrap">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={loading}
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setFormData({ name: "", email: "", password: "" });
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New user? Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;