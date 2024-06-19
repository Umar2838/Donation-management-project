import React from 'react';
import { BsJustify } from 'react-icons/bs';
import { IoLogOutSharp } from "react-icons/io5";


function Header({ openSidebar, onLogout }) {
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={openSidebar} />
      </div>
      <h1 className="header-right">
        Religious Donation and Usage Management System
      </h1>
      <div className="header-actions">
        <IoLogOutSharp className="icon" onClick={onLogout} /> Logout
      </div>
    </header>
  );
}

export default Header;
