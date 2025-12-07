// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white shadow-md fixed w-full z-50 fixed top-0 left-0 h-16" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-[#2596be] border rounded px-3 py-1"
          >
            Smart Expenses Tracker
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {user ? (
              <>
                <Link to="/" className="hover:text-blue-300 transition">
                  Dashboard
                </Link>
                <Link to="/expenses" className="hover:text-blue-300 transition">
                  Expenses
                </Link>
                <button
                  onClick={logout}
                  className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded hover:bg-gray-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/expenses"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded hover:bg-gray-600 transition"
                >
                  Expenses
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded bg-green-500 hover:bg-green-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
