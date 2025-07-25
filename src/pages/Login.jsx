import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome back</h2>
          <p className="text-gray-600 dark:text-gray-300">Sign in to your EcoMarket account</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
