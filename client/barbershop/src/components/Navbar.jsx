import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Scissors className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">BarberBook</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2">Home</Link>
            <Link to="/barbers" className="text-gray-600 hover:text-blue-600 px-3 py-2">Barbers</Link>
            {user ? (
              <>
                <Link to="/appointments" className="text-gray-600 hover:text-blue-600 px-3 py-2">My Appointments</Link>
                <button
                  onClick={logout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/barbers"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Barbers
            </Link>
            {user ? (
              <>
                <Link
                  to="/appointments"
                  className="block text-gray-600 hover:text-blue-600 px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Appointments
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-blue-600 px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-600 hover:text-blue-600 px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-600 hover:text-blue-600 px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};