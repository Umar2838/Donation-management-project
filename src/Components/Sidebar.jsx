import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('manageUser');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/home') {
      setActiveItem('manageUser');
    } else if (path === '/donation') {
      setActiveItem('donationDetails');
    } else if (path === '/expenses') {
      setActiveItem('expensesDetails');
    } else if (path === '/booking') {
      setActiveItem('bookingDetails');
    } else if (path === '/rental') {
      setActiveItem('rentalDetails');
    } else if (path === '/voter') {
      setActiveItem('voter');
    } else if (path === '/report') {
      setActiveItem('report');
    }

  }, [location]);

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
          onClick={() => setActiveItem('manageUser')}
        >
          <Link to="/home">
            <BsPeopleFill className='icon'/> Manage User
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'donationDetails' ? 'active' : ''}`}
          onClick={() => setActiveItem('donationDetails')}
        >
          <Link to="/donation">
            <BsFillArchiveFill className='icon'/> Donation Details
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'expensesDetails' ? 'active' : ''}`}
          onClick={() => setActiveItem('expensesDetails')}
        >
          <Link to="/expenses">
            <BsFillGrid3X3GapFill className='icon'/> Expenses Details
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'bookingDetails' ? 'active' : ''}`}
          onClick={() => setActiveItem('bookingDetails')}
        >
          <Link to="/booking">
            <BsListCheck className='icon'/> Booking Details
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'rentalDetails' ? 'active' : ''}`}
          onClick={() => setActiveItem('rentalDetails')}
        >
          <Link to="/rental">
            <BsMenuButtonWideFill className='icon'/> Rental Details
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'voter' ? 'active' : ''}`}
          onClick={() => setActiveItem('voter')}
        >
          <Link to="/voter">
            <BsPeopleFill className='icon'/> Voter
          </Link>
        </li>
        <li 
          className={`sidebar-list-item ${activeItem === 'report' ? 'active' : ''}`}
          onClick={() => setActiveItem('report')}
        >
          <Link to="/report">
            <BsListCheck className='icon'/> Report
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
