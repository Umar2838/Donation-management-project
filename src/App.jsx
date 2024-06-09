import React, { useState } from 'react';
import {  Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Donation from './Components/Donation';
import Expense from './Components/Expense';
import Booking from './Components/Booking';
import Rental from './Components/Rental';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (

      <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <main className='main-content'>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="/expenses" element={<Expense />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/rental" element={<Rental />} />
          </Routes>
        </main>
      </div>

  );
}

export default App;
