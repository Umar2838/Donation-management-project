import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from "./Components/Login";
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Donation from './Components/Donation';
import Expense from './Components/Expense';
import Booking from './Components/Booking';
import Rental from './Components/Rental';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const login = (email, password) => {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = '123456';

    if (email === adminEmail && password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } else {
      alert('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : "/home" ;
  };

  return (
    <div className="grid-container">
      {isAuthenticated && <Header openSidebar={openSidebar} onLogout={logout} />}
      {isAuthenticated && <Sidebar openSidebarToggle={openSidebarToggle} openSidebar={openSidebar} />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login onLogin={login} />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/donation" element={<ProtectedRoute element={<Donation />} />} />
          <Route path="/expenses" element={<ProtectedRoute element={<Expense />} />} />
          <Route path="/booking" element={<ProtectedRoute element={<Booking />} />} />
          <Route path="/rental" element={<ProtectedRoute element={<Rental />} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
