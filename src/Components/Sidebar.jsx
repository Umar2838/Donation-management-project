import React, { useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [activeItem, setActiveItem] = useState('manageUser');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          FaithFinity ADMIN
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li 
          className={`sidebar-list-item ${activeItem === 'manageUser' ? 'active' : ''}`}
          onClick={() => handleItemClick('manageUser')}
        >
          <Link to="/">
            <BsPeopleFill className='icon'/> Manage User
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'donationDetails' ? 'active' : ''}`}
          onClick={() => handleItemClick('donationDetails')}
        >
          <Link to="/donation">
            <BsFillArchiveFill className='icon'/> Donation Details
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'expensesDetails' ? 'active' : ''}`}
          onClick={() => handleItemClick('expensesDetails')}
        >
          <Link to="/expenses">
            <BsFillGrid3X3GapFill className='icon'/> Expenses Details
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'bookingDetails' ? 'active' : ''}`}
          onClick={() => handleItemClick('bookingDetails')}
        >
          <Link to="/booking">
            <BsListCheck className='icon'/> Booking Details
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'rentalDetails' ? 'active' : ''}`}
          onClick={() => handleItemClick('rentalDetails')}
        >
          <Link to="/rental">
            <BsMenuButtonWideFill className='icon'/> Rental Details
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
