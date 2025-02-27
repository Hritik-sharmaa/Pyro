import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];

  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subtotal = cartItems.reduce(
    (total, game) => total + game.discountedPrice,
    0
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1115]">
      <Navbar />
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8 text-center mt-36 mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <CheckCircle className="text-white" size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="text-gray-500">
          Thank you for your order. We've received it and will begin processing
          right away.
        </p>

        <div className="mt-6 bg-gray-100 p-6 rounded-lg text-left">
          <div className="flex justify-center mb-4 text-gray-700 ">
            
            <div className="text-center">
              <p className="text-sm">Order date</p>
              <p className="font-semibold">{orderDate}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {cartItems.map((game) => (
            <div
              key={game.id}
              className="flex justify-between items-center border-b py-3">
              <div className="flex items-center space-x-3">
                <div className="w-[40%] h-full flex items-center justify-center">
                  <img src={game.poster} alt="" className="rounded-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold">{game.name}</h3>
                </div>
              </div>
              <p className="font-semibold">₹{game.discountedPrice}</p>
            </div>
          ))}

          <div className="mt-4 text-gray-700">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>

            <div className="flex justify-between font-bold text-lg mt-2">
              <p>Total</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-black text-white rounded-lg">
            Continue Shopping →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmed;
