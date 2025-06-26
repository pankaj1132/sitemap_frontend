import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchCartCount = async () => {
      if (token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
   
          const totalItems = res.data.items
            ?.filter(item => item.productId)
            ?.reduce((total, item) => total + item.quantity, 0) || 0;
          setCartItemCount(totalItems);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };
    
    fetchCartCount();
    
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${colors.bg.gradient} text-white shadow-lg transition-all duration-300`}>
      <div className="container mx-auto  px-4">
        <div className="flex justify-between items-center py-4">
          
          <Link to="/" className="flex items-center space-x-2 group transform hover:scale-105 transition-transform duration-200">
            <div className={`${isDarkMode ? 'bg-green-400 text-gray-900' : 'bg-white text-black'} rounded-full p-2 group-hover:rotate-12 transition-transform duration-300`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">EcoMarket</h1>
              <p className={`text-xs ${isDarkMode ? 'text-green-300' : 'text-gray-300'}`}>Sustainable Shopping</p>
            </div>
          </Link>

          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`hover:${isDarkMode ? 'text-green-200' : 'text-gray-300'} transition-all duration-200 hover:scale-110 transform`}>
              Home
            </Link>
            <Link to="/shop" className={`hover:${isDarkMode ? 'text-green-200' : 'text-gray-300'} transition-all duration-200 hover:scale-110 transform`}>
              Shop
            </Link>
            <Link to="/cart" className={`hover:${isDarkMode ? 'text-green-200' : 'text-gray-300'} transition-all duration-200 flex items-center relative group transform hover:scale-110`}>
              <svg className="w-5 h-5 mr-1 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5 6.5m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"></path>
              </svg>
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-110 hover:rotate-180"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {token ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className={`hover:${isDarkMode ? 'text-green-200' : 'text-gray-300'} transition-all duration-200 flex items-center space-x-1 group transform hover:scale-110`}
                >
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Profile</span>
                </Link>
                <span className={`${isDarkMode ? 'text-green-300' : 'text-gray-300'}`}>Hi, {user?.name}</span>
                <button 
                  onClick={handleLogout} 
                  className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-800 hover:bg-green-900'} px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`hover:${isDarkMode ? 'text-green-200' : 'text-gray-300'} transition-all duration-200 transform hover:scale-110`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`${isDarkMode ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-white text-black hover:bg-gray-100 border border-gray-300'} px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 transform hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className={`w-6 h-6 transform transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-green-500'} pt-4`}>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-green-200 py-2 px-2 rounded transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2">
                Home
              </Link>
              <Link to="/shop" className="hover:text-green-200 py-2 px-2 rounded transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2">
                Shop
              </Link>
              <Link to="/cart" className="hover:text-green-200 py-2 px-2 rounded flex items-center relative transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2">
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 py-2 px-2 rounded hover:text-green-200 transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2"
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
                <span>{isDarkMode ? 'Dark Mode' : ' Light Mode '}</span>
              </button>
              
              {token ? (
                <>
                  <Link to="/profile" className="hover:text-green-200 py-2 px-2 rounded flex items-center space-x-1 transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Profile</span>
                  </Link>
                  <span className={`${isDarkMode ? 'text-green-300' : 'text-green-200'} py-2 px-2`}>Hi, {user?.name}</span>
                  <button onClick={handleLogout} className="text-left hover:text-green-200 py-2 px-2 rounded transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-green-200 py-2 px-2 rounded transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2">
                    Login
                  </Link>
                  <Link to="/signup" className="hover:text-green-200 py-2 px-2 rounded transition-all duration-200 hover:bg-white hover:bg-opacity-10 transform hover:translate-x-2">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
