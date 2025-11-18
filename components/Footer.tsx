import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon, TwitterIcon, FacebookIcon, LinkedInIcon } from './Icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-card)] border-t border-[var(--color-border)] mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-4 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 text-2xl font-bold mb-4">
              <LogoIcon />
              <span className="theme-gradient-text">ContestCraft AI</span>
            </Link>
            <p className="max-w-xs text-[var(--color-text-muted)] text-sm">
              The leading platform for creating and participating in engaging, AI-powered contests. Join us to discover, compete, and win.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" aria-label="Twitter" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"><TwitterIcon /></a>
              <a href="#" aria-label="Facebook" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"><FacebookIcon /></a>
              <a href="#" aria-label="LinkedIn" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] transition-colors"><LinkedInIcon /></a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-sm text-[var(--color-text-heading)] tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">Home</Link></li>
              <li><Link to="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">All Contests</Link></li>
              <li><Link to="/auth" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">For Companies</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-sm text-[var(--color-text-heading)] tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-sm text-[var(--color-text-heading)] tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--color-border)] pt-8 text-center text-sm text-[var(--color-text-muted)]">
          <p>&copy; {currentYear} ContestCraft AI. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;