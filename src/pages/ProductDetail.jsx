import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.post(
        'http://localhost:3001/api/cart/add',
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      showSuccess(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Link to="/shop" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/" className="text-green-600 hover:text-green-700">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/shop" className="text-green-600 hover:text-green-700">Shop</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-96 lg:h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-green-600">${product.price}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sustainability</h3>
              <p className="text-green-700 bg-green-50 p-3 rounded-lg">
                🌱 {product.sustainability}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition duration-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition duration-200"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={addToCart}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5 6.5m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"></path>
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Link 
                to="/shop"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition duration-200 text-center"
              >
                Continue Shopping
              </Link>
              {token && (
                <Link 
                  to="/cart"
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-6 py-3 rounded-lg font-medium transition duration-200 text-center"
                >
                  View Cart
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
