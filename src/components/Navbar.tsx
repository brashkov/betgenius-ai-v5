import { Menu, X, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">BetGenius AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Dashboard</Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/features" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Features</Link>
                <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Pricing</Link>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Dashboard</Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/features" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Features</Link>
                <Link to="/pricing" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Pricing</Link>
                <Link to="/login" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Login</Link>
                <Link to="/register" className="block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}