import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails, billingAddress } = location.state || {};

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been successfully processed.</p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Order Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{orderDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(orderDetails.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600 capitalize">{orderDetails.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Payment Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{orderDetails.paymentMethod.brand} ****{orderDetails.paymentMethod.lastFour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">${orderDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium">{orderDetails.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            {billingAddress && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Billing Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                  <p>{billingAddress.address}</p>
                  <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                  <p>{billingAddress.country}</p>
                  <p className="mt-1">{billingAddress.email}</p>
                </div>
              </div>
            )}

            {/* Ordered Items */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Paid</span>
                <span className="text-green-600">${orderDetails.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive an order confirmation email shortly</li>
              <li>• We'll send you shipping updates as your order is processed</li>
              <li>• Your eco-friendly products will be carefully packaged and shipped</li>
              <li>• Estimated delivery: 3-5 business days</li>
            </ul>
          </div>

          {/* Environmental Impact */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-green-800 mb-2">🌱 Environmental Impact</h3>
            <p className="text-sm text-green-700">
              Thank you for choosing sustainable products! Your purchase helps support eco-friendly practices 
              and reduces environmental impact. Together, we're making a difference for our planet.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium transition duration-200 text-center"
            >
              Back to Home
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200"
            >
              Print Receipt
            </button>
          </div>

          {/* Customer Support */}
          <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Need help with your order? 
              <a href="mailto:support@sustainable-marketplace.com" className="text-green-600 hover:text-green-700 ml-1">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
