
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { LogoIcon } from './Icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user ? (user.role.startsWith('company') ? '/company/dashboard' : '/participant/dashboard') : '/';

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 dark:text-white">
            <LogoIcon />
            <span>ContestCraft AI</span>
          </Link>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to={dashboardLink} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
                <span className="text-gray-600 dark:text-gray-300">|</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{user.display_name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login / Sign Up
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
