import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

function CartPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');


useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  const removeFromCart = async productId => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({
        ...cart,
        items: cart.items.filter(item => item.productId && item.productId._id !== productId),
      });
      
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      showSuccess('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      showError('Error removing item from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCart({
        ...cart,
        items: cart.items.map(item =>
          item.productId && item.productId._id === productId
            ? { ...item, quantity }
            : item
        ),
      });
      
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError('Error updating quantity');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const getTotalPrice = () => {
    return cart.items
      .filter(item => item.productId)
      .reduce((total, item) => total + ((item.productId.price || 0) * item.quantity), 0);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <svg className="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5 6.5m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"></path>
            </svg>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/shop" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4  mt-12 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {cart.items.filter(item => item.productId).map((item, index) => (
                <div key={item.productId._id} className={`p-4 md:p-6 ${index !== cart.items.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''}`}>
                  <div className="hidden md:flex items-center space-x-4">
                    <img 
                      src={item.productId.image || '/placeholder-image.jpg'} 
                      alt={item.productId.name || 'Product'}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.productId.name || 'Product Name'}</h3>
                      <p className="text-sm text-green-600 mb-1">{item.productId.sustainability || 'Eco-friendly'}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{item.productId.description || 'Product description'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition duration-200"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition duration-200"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.productId.price || 0} each
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.productId._id)}
                        className="text-red-500 hover:text-red-700 p-2 transition duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <div className="flex space-x-3 mb-3">
                      <img 
                        src={item.productId.image || '/placeholder-image.jpg'} 
                        alt={item.productId.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">{item.productId.name || 'Product Name'}</h3>
                        <p className="text-xs text-green-600 mb-1">{item.productId.sustainability || 'Eco-friendly'}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">{item.productId.description || 'Product description'}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId._id)}
                        className="text-red-500 hover:text-red-700 p-1 transition duration-200 flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition duration-200"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition duration-200"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.productId.price || 0} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal ({cart.items.filter(item => item.productId).reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span className="text-gray-800 dark:text-gray-100">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="text-gray-800 dark:text-gray-100">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t dark:border-gray-600 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-green-600">${(getTotalPrice() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout', { 
                  state: { 
                    cart, 
                    total: getTotalPrice() * 1.1 
                  } 
                })}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition duration-200 mb-3"
              >
                Proceed to Checkout
              </button>
              
              <Link 
                to="/shop" 
                className="block w-full text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-medium transition duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
