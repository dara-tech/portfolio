import { useState } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle, LogIn } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, handleLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md bg-base-100 shadow-2xl"
      >
        <div className="card-body p-8">
          <h2 className="card-title text-3xl font-bold text-center mb-8 text-primary">Admin Login</h2>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="alert alert-error mb-6 shadow-lg"
            >
              <AlertCircle className="w-6 h-6" />
              <span>{error}</span>
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-semibold">Username</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary focus:outline-none w-full pl-10 pr-4 py-2"
                  placeholder="Enter your username"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-semibold">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary focus:outline-none w-full pl-10 pr-10 py-2"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="form-control mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </>
                )}
              </motion.button>
            </div>
          </form>
          {/* <div className="divider my-8">OR</div>
          <div className="text-center">
            <a href="/forgot-password" className="link link-primary text-sm hover:underline">
              Forgot Password?
            </a>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
