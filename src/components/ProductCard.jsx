import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

function ProductCard({ product }) {
  const { showSuccess, showError } = useToast();
  const { colors } = useTheme();
  
  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login to add items to cart');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3001/api/cart/add',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      showSuccess('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding to cart. Please try again.');
    }
  };

  return (
    <div className={`${colors.border.primary} border rounded-lg overflow-hidden ${colors.bg.card} shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}>
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
          {product.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`text-lg font-semibold mb-2 ${colors.text.primary} group-hover:text-green-600 transition-colors duration-200`}>{product.name}</h3>
        <p className="text-2xl font-bold text-green-600 mb-2">${product.price}</p>
        <p className={`text-sm text-green-700 mb-3 ${colors.bg.tertiary} p-2 rounded transition-colors duration-200`}>
          🌱 {product.sustainability}
        </p>
        <p className={`${colors.text.secondary} text-sm mb-4 line-clamp-2`}>
          {product.description}
        </p>
        
        <div className="flex gap-2">
          <Link 
            to={`/product/${product._id}`} 
            className={`flex-1 ${colors.button.secondary} px-4 py-2 rounded-lg text-center font-medium transition-all duration-200 transform hover:scale-105`}
          >
            View Details
          </Link>
          <button 
            onClick={addToCart}
            className={`flex-1 ${colors.button.primary} px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 hover:shadow-lg`}
          >
            <svg className="w-4 h-4 mr-1 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5 6.5m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"></path>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
