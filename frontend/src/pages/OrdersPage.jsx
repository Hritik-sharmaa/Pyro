import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { FaCreditCard, FaGooglePay } from "react-icons/fa";
import { SiPhonepe } from "react-icons/si";
import "../styles/Common.css";
import CreditCard from "/credit-card.png";
import UPI from "/cashless-payment.png"

const OrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = useAuthStore((state) => state.userId);

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("No items in the cart!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, paymentMethod }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/order-confirmed", { state: { cartItems } });
      } else {
        alert(data.error || "Payment failed. Try again.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-black flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg font">
        <Link to="/cart">
          <h1 className="text-center logo text-[#FF4438] text-3xl mb-10">
            Pyro
          </h1>
        </Link>
        {!paymentMethod ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Choose Payment Option</h2>
            <div className="space-y-4">
              <button
                className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-gray-100 border-gray-300"
                onClick={() => setPaymentMethod("card")}>
                <span>Debit / Credit Card</span>
                <FaCreditCard size={24} />
              </button>

              <button
                className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-gray-100 border-gray-300"
                onClick={() => setPaymentMethod("gpay")}>
                <span>Google Pay</span>
                <FaGooglePay size={24} />
              </button>
              <button
                className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-gray-100 border-gray-300"
                onClick={() => setPaymentMethod("phonepe")}>
                <span>PhonePe</span>
                <SiPhonepe size={24} />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setPaymentMethod(null)}
              className="text-gray-500 text-sm mb-1">
              &larr; Back to Payment Options
            </button>
            <div>
              {paymentMethod === "card" ? (
                <div className="flex justify-center mb-3">
                  <img
                    src={CreditCard}
                    alt="card Image"
                    className="w-[150px]"
                  />
                </div>
              ) : (
                <div className="flex justify-center mb-3 mt-3">
                  <img
                    src={UPI}
                    alt="card Image"
                    className="w-[150px]"
                  />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-6">
              {paymentMethod === "card" ? "Debit / Credit Card" : "UPI "}
            </h2>
            {paymentMethod === "card" && (
              <>
                <label>Card Number</label>
                <input
                  type="number"
                  className="w-full border p-2 mb-4 rounded outline-gray-300"
                  placeholder="12XX XXXX XX12"
                  maxLength="12"
                  required
                />
                <div className="flex gap-4">
                  <div>
                    <label>Expiry Year</label>
                    <input
                      type="month"
                      className="w-full border p-2 mb-4 rounded outline-gray-300"
                      placeholder="MM"
                      required
                    />
                  </div>

                  <div>
                    <label>CVV</label>
                    <input
                      type="password"
                      className="w-full border p-2 mb-4 rounded outline-gray-300"
                      maxLength="3"
                      placeholder="XXX"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            {(paymentMethod === "gpay" || paymentMethod === "phonepe") && (
              <>
                <label>UPI ID </label>
                <input
                  type="text"
                  className="w-full border p-2 mb-4 rounded outline-gray-300"
                  placeholder="ABCD@xyz.com"
                  required
                />
              </>
            )}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600">
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
