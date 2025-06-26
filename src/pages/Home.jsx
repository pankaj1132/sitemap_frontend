import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useTheme } from '../contexts/ThemeContext';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
        setFeaturedProducts(res.data.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const seedProducts = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products/seed`);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
      setFeaturedProducts(res.data.slice(0, 6));
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg.primary} transition-colors duration-300`}>
      
      <div className={`${colors.bg.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mt-16">
            <h1 className="text-5xl font-bold text-white mb-6 animate-fadeIn">
              Welcome to EcoMarket
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto animate-fadeIn delay-100">
              Shop sustainably with eco-friendly brands! Discover products that are good for you and the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-200">
              <Link 
                to="/shop" 
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 inline-block transform hover:scale-105 hover:shadow-lg"
              >
                Shop Now
              </Link>
              {featuredProducts.length === 0 && (
                <button 
                  onClick={seedProducts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  Load Sample Products
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      
      <div className={`py-16 ${colors.bg.secondary}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${colors.text.primary} mb-4 animate-fadeIn`}>Why Choose EcoMarket?</h2>
            <p className={`${colors.text.secondary} max-w-2xl mx-auto animate-fadeIn delay-100`}>
              We're committed to providing sustainable, eco-friendly products that make a positive impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300 group-hover:animate-bounce">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Eco-Friendly</h3>
              <p className={colors.text.secondary}>All products are sustainably sourced and environmentally responsible</p>
            </div>
            
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300 group-hover:animate-bounce">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Quality Assured</h3>
              <p className={colors.text.secondary}>Premium quality products tested for durability and performance</p>
            </div>
            
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300 group-hover:animate-bounce">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Fast Delivery</h3>
              <p className={colors.text.secondary}>Quick and reliable shipping with eco-friendly packaging</p>
            </div>
          </div>
        </div>
      </div>

      
      <div className={`py-16 ${colors.bg.tertiary}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${colors.text.primary} mb-4 animate-fadeIn`}>Featured Products</h2>
            <p className={`${colors.text.secondary} animate-fadeIn delay-100`}>Discover our most popular eco-friendly products</p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className={`mt-4 ${colors.text.secondary}`}>Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 animate-fadeIn">
              <svg className={`w-16 h-16 ${colors.text.muted} mx-auto mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <h3 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>No products available</h3>
              <p className={`${colors.text.secondary} mb-6`}>Get started by loading our sample eco-friendly products</p>
              <button 
                onClick={seedProducts}
                className={`${colors.button.primary} px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
              >
                Load Sample Products
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProducts.map((product, index) => (
                  <div key={product._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              <div className="text-center animate-fadeIn">
                <Link 
                  to="/shop" 
                  className={`${colors.button.primary} px-8 py-3 rounded-lg font-medium transition-all duration-200 inline-block transform hover:scale-105 hover:shadow-lg`}
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
