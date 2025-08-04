import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const { login, register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  // ✅ Force logout when visiting this page
  useEffect(() => {
    useAuthStore.getState().logout();
    localStorage.removeItem("farewave-auth");
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(formData.email, formData.password);
      navigate("/dashboard"); // ✅ Navigate only after successful login
    } else {
      await register(formData.name, formData.email, formData.password);
      navigate("/dashboard"); // ✅ Navigate only after successful signup
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white overflow-hidden">
      {/* Left Image Section */}
      <motion.div
        className="w-full md:w-1/2 h-64 md:h-full"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=80"
          alt="Bus Travel"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 py-12">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border"
        >
          <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
            {isLogin ? "Login to FareWave" : "Create an Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                required
              />
            )}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400"
              required
            />

            {error && (
              <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-green-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="text-green-600 font-semibold ml-1 hover:underline"
            >
              {isLogin ? "Signup" : "Login"}
            </button>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6 text-gray-600 italic text-sm max-w-md"
        >
          “Traveling – it leaves you speechless, then turns you into a storyteller.” – Ibn Battuta
        </motion.p>
      </div>
    </div>
  );
};

export default AuthPage;
