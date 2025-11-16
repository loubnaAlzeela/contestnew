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
    <header className="bg-[var(--color-bg-card)] border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 text-2xl font-bold">
            <LogoIcon />
            <span className="theme-gradient-text">ContestCraft AI</span>
          </Link>
          <nav className="flex items-center space-x-4 md:space-x-6">
            {user ? (
              <>
                <Link to={dashboardLink} className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]">Dashboard</Link>
                <div className='hidden sm:flex items-center space-x-4'>
                    <span className="text-[var(--color-border)]">|</span>
                    <span className="text-sm font-medium text-[var(--color-text-base)]">{user.display_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="theme-gradient-bg theme-gradient-bg-hover text-white px-4 py-2 rounded-md font-semibold text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="theme-gradient-bg theme-gradient-bg-hover text-white px-4 py-2 rounded-md font-semibold text-sm"
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