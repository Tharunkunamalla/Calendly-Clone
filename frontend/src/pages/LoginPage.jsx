import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {authApi} from "../utils/api";
import {useAuth} from "../context/AuthContext";
import {toast} from "react-toastify";
import {Lock, Mail, ShieldCheck} from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@candely.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {data} = await authApi.login(email, password);
      login(data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please check your API URL and backend deployment.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "#006bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
          }}
        >
          C
        </div>
        <span
          className="brand-wordmark"
          style={{fontSize: "1.15rem", fontWeight: "800", color: "#1e293b"}}
        >
          Candely
        </span>
      </div>

      <div style={{display: "grid", placeItems: "center", padding: "1.5rem"}}>
        <div className="auth-card">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "rgba(0, 107, 255, 0.12)",
                color: "#006bff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={24} />
            </div>
          </div>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Log in to your account to continue</p>

          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{position: "relative"}}>
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="auth-input"
                  style={{paddingLeft: "2.6rem"}}
                />
              </div>
            </div>

            <div className="form-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label className="form-label">Password</label>
                <a
                  href="#"
                  style={{
                    fontSize: "0.8rem",
                    color: "#006bff",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{position: "relative"}}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  style={{paddingLeft: "2.6rem"}}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{width: "100%", marginTop: "0.25rem"}}
            >
              {loading ? "Authenticating..." : "Log in"}
            </button>
          </form>

          <div
            style={{marginTop: "2rem", textAlign: "center", fontSize: "0.9rem"}}
          >
            <span style={{color: "#64748b"}}>Don't have an account? </span>
            <a
              href="#"
              style={{
                color: "#006bff",
                fontWeight: "800",
                textDecoration: "none",
              }}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
