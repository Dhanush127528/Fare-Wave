import React from "react";
import {Routes, Route } from "react-router-dom";

// Pages
import SplashScreen from "./pages/SplashScreen";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard"; // You'll create this next
import BookTicket from "./pages/BookTicket";
import ScanQR from "./pages/ScanQR";
import RideHistory from "./pages/RideHistory";
import TrackMe from "./pages/TrackMe";
import AddMoney from "./pages/AddMoney";

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-ticket" element={<BookTicket />} />
        <Route path="/scan-qr" element={<ScanQR />} />
        <Route path="/ride-history" element={<RideHistory />} />
        <Route path="/track-me" element={<TrackMe />} />
        <Route path="/add-money" element={<AddMoney />} />
        
      </Routes>
    
  );
};

export default App;
