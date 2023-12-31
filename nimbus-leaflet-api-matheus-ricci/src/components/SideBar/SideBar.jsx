import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../SideBar/SideBar.css';

const SideBar = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className='sidebar'>
      <div id="cssmenu">
        <ul id='page-link'>
          <li style={isActive('/') ? { backgroundColor: '#F3F3F3', color: '#333333' } : {}} onClick={() => { window.location.reload() }}>
            <Link to="/">Gerenciamento</Link>
          </li>
          <li style={isActive('/visualizacao') ? { backgroundColor: '#F3F3F3', color: '#333333' } : {}}>
            <Link to="/visualizacao">Visualização</Link>
          </li>
        </ul>
        <ul>
          {children}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
