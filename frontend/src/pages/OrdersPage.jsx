import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { FaCreditCard, FaGooglePay, FaArrowLeft, FaLock } from "react-icons/fa"
import { SiPhonepe } from "react-icons/si"
import "../styles/Common.css"
import CreditCard from "/credit-card.png"
import UPI from "/cashless-payment.png"

const OrdersPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const cartItems = location.state?.cartItems || []
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const userId = useAuthStore((state) => state.userId)

  useEffect(() => {
    // Calculate total amount from cart items
    if (cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.discountedPrice, 0)
      setTotalAmount(total)
    }
  }, [cartItems])

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("No items in the cart!")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, paymentMethod }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate("/order-confirmed", { state: { cartItems } })
      } else {
        alert(data.error || "Payment failed. Try again.")
      }
    } catch (error) {
      console.error("Error during payment:", error)
      alert("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1115] to-[#1a1d25] text-white flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1c1f26] to-[#252a36] p-8 rounded-2xl shadow-2xl border border-gray-800 font relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Link to="/cart" className="block mb-8">
            <h1 className="text-center logo text-[#FF4438] text-4xl font-bold mb-2">Pyro</h1>
            <p className="text-center text-gray-400 text-sm">Secure Checkout</p>
          </Link>

          {/* Order summary */}
          <div className="bg-[#0f1115]/50 p-4 rounded-xl mb-6 border border-gray-800/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Items:</span>
              <span className="font-medium">{cartItems.length}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Total:</span>
              <span className="font-bold text-xl">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-center mt-3">
              <FaLock className="text-green-400 mr-2" size={12} />
              <span className="text-xs text-gray-400">Secure Transaction</span>
            </div>
          </div>

          {!paymentMethod ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">Choose Payment Option</h2>
              <div className="space-y-4">
                <button
                  className="flex items-center justify-between w-full p-5 rounded-xl transition-all duration-300 bg-gradient-to-r from-[#2a2d36]/80 to-[#2a2d36]/40 hover:from-[#3a3e4a] hover:to-[#2a2d36] border border-gray-700/50 hover:border-gray-600 group"
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-all">
                      <FaCreditCard size={20} className="text-blue-400" />
                    </div>
                    <span className="font-medium">Debit / Credit Card</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-blue-400 transition-all">
                    <div className="w-0 h-0 rounded-full bg-blue-400 group-hover:w-3 group-hover:h-3 transition-all"></div>
                  </div>
                </button>

                <button
                  className="flex items-center justify-between w-full p-5 rounded-xl transition-all duration-300 bg-gradient-to-r from-[#2a2d36]/80 to-[#2a2d36]/40 hover:from-[#3a3e4a] hover:to-[#2a2d36] border border-gray-700/50 hover:border-gray-600 group"
                  onClick={() => setPaymentMethod("gpay")}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3 group-hover:bg-green-500/20 transition-all">
                      <FaGooglePay size={20} className="text-green-400" />
                    </div>
                    <span className="font-medium">Google Pay</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-green-400 transition-all">
                    <div className="w-0 h-0 rounded-full bg-green-400 group-hover:w-3 group-hover:h-3 transition-all"></div>
                  </div>
                </button>

                <button
                  className="flex items-center justify-between w-full p-5 rounded-xl transition-all duration-300 bg-gradient-to-r from-[#2a2d36]/80 to-[#2a2d36]/40 hover:from-[#3a3e4a] hover:to-[#2a2d36] border border-gray-700/50 hover:border-gray-600 group"
                  onClick={() => setPaymentMethod("phonepe")}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3 group-hover:bg-purple-500/20 transition-all">
                      <SiPhonepe size={20} className="text-purple-400" />
                    </div>
                    <span className="font-medium">PhonePe</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-purple-400 transition-all">
                    <div className="w-0 h-0 rounded-full bg-purple-400 group-hover:w-3 group-hover:h-3 transition-all"></div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setPaymentMethod(null)}
                className="flex items-center text-gray-400 hover:text-white text-sm mb-6 transition-colors"
              >
                <FaArrowLeft className="mr-2" size={12} />
                Back to Payment Options
              </button>

              <div className="flex justify-center mb-6">
                {paymentMethod === "card" ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl rounded-full"></div>
                    <img src={CreditCard || "/placeholder.svg"} alt="Card Image" className="w-[120px] relative z-10" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 opacity-20 blur-xl rounded-full"></div>
                    <img src={UPI || "/placeholder.svg"} alt="UPI Image" className="w-[120px] relative z-10" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                {paymentMethod === "card" ? "Debit / Credit Card" : paymentMethod === "gpay" ? "Google Pay" : "PhonePe"}
              </h2>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full bg-[#0f1115] border border-gray-700 p-3 rounded-lg outline-none focus:border-blue-500 transition-colors text-white pl-10"
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        required
                      />
                      <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                      <input
                        type="month"
                        className="w-full bg-[#0f1115] border border-gray-700 p-3 rounded-lg outline-none focus:border-blue-500 transition-colors text-white"
                        required
                      />
                    </div>

                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                      <input
                        type="password"
                        className="w-full bg-[#0f1115] border border-gray-700 p-3 rounded-lg outline-none focus:border-blue-500 transition-colors text-white"
                        maxLength="3"
                        placeholder="•••"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {(paymentMethod === "gpay" || paymentMethod === "phonepe") && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">UPI ID</label>
                  <input
                    type="text"
                    className="w-full bg-[#0f1115] border border-gray-700 p-3 rounded-lg outline-none focus:border-purple-500 transition-colors text-white"
                    placeholder="username@upi"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your registered UPI ID linked with your bank account
                  </p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden ${
                  loading
                    ? "bg-gray-600"
                    : paymentMethod === "card"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                      : paymentMethod === "gpay"
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                        : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Pay ₹{totalAmount.toFixed(2)}</>
                  )}
                </span>
                {!loading && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full transition-transform ease-out duration-700 group-hover:translate-x-0"></div>
                )}
              </button>

              <div className="flex items-center justify-center mt-4">
                <FaLock className="text-green-400 mr-2" size={12} />
                <span className="text-xs text-gray-400">Your payment information is secure</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
