import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // your logo here

const SplashScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        navigate("/auth");
      }, 300);
    }
  }, [progress, navigate]);

  return (
    <div className="h-screen w-full bg-gradient-to-tr from-teal-300 via-white to-emerald-100 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="rounded-full p-4 shadow-2xl bg-white"
      >
        <img src={logo} alt="FareWave Logo" className="w-28 h-28 object-cover rounded-full shadow-inner" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-4xl font-extrabold text-emerald-700 mt-6 tracking-wider drop-shadow-md"
      >
        FAREWAVE
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-sm text-gray-600 mt-1 mb-6"
      >
        Experience smart travel solutions
      </motion.p>

      {/* Progress Bar */}
      <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2 animate-pulse">{progress}% loaded</p>
    </div>
  );
};

export default SplashScreen;
