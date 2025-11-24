import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MessageSquare,
  PackageCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { requestOrderCancellation } from "../features/cart/checkoutSlice";

// SERVER_URL tidak lagi dibutuhkan untuk gambar Cloudinary
// const API_URL = import.meta.env.VITE_API_URL;
// const SERVER_URL = API_URL ? API_URL.replace("/api", "") : "http://localhost:3000";

const ConfirmationModal = ({ order, onConfirm, onCancel }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm animate-fade-in">
        <h2 className="text-xl font-bold mb-4">Complete Order?</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to complete order #{order._id.substring(0, 8)}
          ...? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="py-2 px-6 bg-gray-200 text-black rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(order._id)}
            className="py-2 px-6 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Yes, Complete
          </button>
        </div>
      </div>
    </div>
  );
};

const CancellationModal = ({ order, onCancel, onSubmit }) => {
  const [reason, setReason] = useState("");
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <h2 className="text-xl font-bold mb-4">Request Order Cancellation?</h2>
        <p className="text-gray-600 mb-4">
          Please enter the reason for cancelling order #
          {order._id.substring(0, 8)}....
        </p>
        <textarea
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Example: I ordered the wrong product..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
        ></textarea>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="py-2 px-6 bg-gray-200 text-black rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={() => onSubmit(order._id, reason)}
            disabled={!reason.trim()}
            className="py-2 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            Submit Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const digits = String(phone).replace(/\D/g, "");
  let formatted = "+62 ";
  if (digits.length > 4) {
    // Format: +62 812-3456-7890
    let remaining = digits;
    if (remaining.length > 4) {
      formatted += remaining.substring(0, 4) + "-";
      remaining = remaining.substring(4);
    }
    if (remaining.length > 4) {
      formatted += remaining.substring(0, 4) + "-";
      remaining = remaining.substring(4);
    }
    formatted += remaining;
  } else {
    formatted += digits;
  }
  return formatted;
};

const TrackerStep = ({ icon, label, isActive, isCompleted }) => {
  return (
    <div className="flex flex-col items-center text-center w-24 z-10">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          isActive
            ? "bg-black border-black scale-110"
            : "bg-white border-gray-300"
        } ${isCompleted ? "bg-black border-black" : ""}`}
      >
        {React.cloneElement(icon, {
          size: 24,
          className: `transition-colors duration-300 ${
            isActive || isCompleted ? "text-white" : "text-gray-400"
          }`,
        })}
      </div>
      <p
        className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
          isActive || isCompleted ? "text-black" : "text-gray-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
};



const Pesanan = ({
  checkouts,
  user,
  reviews,
  onConfirmFinished,
  onRequestCancellation,
}) => {
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            Please log in to view your order history.
          </p>
          <Link
            to="/"
            className="bg-black text-white py-3 px-8 rounded-sm font-medium hover:bg-gray-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const userCheckouts = checkouts || [];

  // Status levels for progress bar logic
  const statusLevels = {
    pending: 0,
    diproses: 1,
    "pembatalan diajukan": 1,
    dikirim: 2,
    sampai: 3,
    "pengembalian diajukan": 3,
    "pengembalian ditolak": 3,
    selesai: 4,
    "pengembalian berhasil": 4,
    dibatalkan: 4,
  };

  const handleConfirm = (orderId) => {
    onConfirmFinished(orderId);
    setConfirmingOrder(null);
  };
 
const handleSubmitCancellation = async (orderId, reason) => {
  const resultAction = await dispatch(
    requestOrderCancellation({ orderId, reason })
  );

  if (requestOrderCancellation.fulfilled.match(resultAction)) {
    alert("Cancellation submitted!");
    window.location.reload();
  } else {
    alert(resultAction.payload || "Failed to request cancellation");
  }

  setCancellingOrder(null);
};




  return (
    <>
      <ConfirmationModal
        order={confirmingOrder}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmingOrder(null)}
      />
      <CancellationModal
        order={cancellingOrder}
        onSubmit={handleSubmitCancellation}
        onCancel={() => setCancellingOrder(null)}
      />

      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
          >
            <ArrowLeft size={20} /> Back to Shop
          </Link>
          <h1 className="text-4xl font-bold text-black mb-8">
            Your Order History
          </h1>

          {userCheckouts.length > 0 ? (
            <div className="space-y-8">
              {userCheckouts.map((order) => {
                const isReturnSuccess =
                  order.status === "pengembalian berhasil";
                const isCancelled = order.status === "dibatalkan";
                const currentStatusLevel = statusLevels[order.status] || 0;

                return (
                  <div
                    key={order._id}
                    className="bg-white p-6 rounded-sm border"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-6">
                      <div>
                        <p className="font-bold text-lg">
                          Order #{order._id.substring(0, 8)}...
                        </p>
                        <p className="text-sm text-gray-500">
                          Date:{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className="font-semibold capitalize text-black">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 sm:px-4 my-8 relative">
                      <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 -translate-y-1/2"></div>
                      <div
                        className="absolute top-6 left-0 h-1 bg-black -translate-y-1/2 transition-all duration-500"
                        style={{
                          width: `${
                            currentStatusLevel > 0
                              ? (currentStatusLevel - 1) * 33.3
                              : 0
                          }%`,
                        }}
                      ></div>
                      <TrackerStep
                        icon={<Package />}
                        label="Processed"
                        isActive={currentStatusLevel === 1}
                        isCompleted={currentStatusLevel >= 1}
                      />
                      <TrackerStep
                        icon={<Truck />}
                        label="Shipped"
                        isActive={currentStatusLevel === 2}
                        isCompleted={currentStatusLevel >= 2}
                      />
                      <TrackerStep
                        icon={<CheckCircle />}
                        label="Delivered"
                        isActive={currentStatusLevel === 3}
                        isCompleted={currentStatusLevel >= 3}
                      />
                      <TrackerStep
                        icon={isCancelled ? <XCircle /> : <PackageCheck />}
                        label={
                          isReturnSuccess
                            ? "Returned"
                            : isCancelled
                            ? "Cancelled"
                            : "Completed"
                        }
                        isActive={currentStatusLevel === 4}
                        isCompleted={currentStatusLevel >= 4}
                      />
                    </div>

                    {order.status === "pending" && (
                      <div className="text-center border-t border-b py-6 my-6 bg-blue-50 text-blue-800">
                        <h3 className="font-semibold mb-4">
                          Your order is waiting for payment.
                        </h3>
                        <p className="text-sm">
                          Please complete your payment via the Midtrans page.
                        </p>
                      </div>
                    )}
                    {order.status === "diproses" && (
                      <div className="text-center border-t border-b py-6 my-6 bg-gray-50">
                        <h3 className="font-semibold text-black mb-4">
                          Your order is being prepared.
                        </h3>
                        <button
                          onClick={() => setCancellingOrder(order)}
                          className="py-2 px-6 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                    {order.status === "pembatalan diajukan" && (
                      <div className="text-center border-t border-b py-6 my-6 bg-yellow-50 text-yellow-800 flex items-center justify-center gap-3">
                        <AlertCircle size={20} />{" "}
                        <p>Awaiting cancellation approval from admin.</p>
                      </div>
                    )}
                    {order.status === "sampai" && (
                      <div className="text-center border-t border-b py-6 my-6 bg-gray-50">
                        <h3 className="font-semibold text-black mb-4">
                          The order has arrived at its destination.
                        </h3>
                        <div className="flex justify-center gap-4">
                          <Link
                            to={`/pengembalian-barang/${order._id}`}
                            className="py-2 px-6 bg-white border border-gray-300 text-black rounded-md hover:bg-gray-100"
                          >
                            Request Return
                          </Link>
                          <button
                            onClick={() => setConfirmingOrder(order)}
                            className="py-2 px-6 bg-black text-white rounded-md hover:bg-gray-800"
                          >
                            Order Completed
                          </button>
                        </div>
                      </div>
                    )}
                    {order.status === "pengembalian diajukan" && (
                      <div className="text-center border-t border-b py-6 my-6 bg-yellow-50 text-yellow-800 flex items-center justify-center gap-3">
                        <AlertCircle size={20} />{" "}
                        <p>
                          Awaiting return approval (max. 2x24 hour process).
                        </p>
                      </div>
                    )}
                    {isReturnSuccess && (
                      <div className="text-center border-t border-b py-6 my-6 bg-green-50 text-green-800 flex items-center justify-center gap-3">
                        <CheckCircle size={20} />{" "}
                        <p>Your return request has been approved.</p>
                      </div>
                    )}
                    {order.status === "pengembalian ditolak" && (
                      <div className="text-center border-t border-b py-6 my-6 bg-red-50 text-red-800">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <XCircle size={20} />{" "}
                          <p>Your return request was rejected.</p>
                        </div>
                        <button
                          onClick={() => setConfirmingOrder(order)}
                          className="py-2 px-6 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                        >
                          Complete Order
                        </button>
                      </div>
                    )}

                    <div className="border-t grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-lg">
                          Order Details
                        </h4>
                        <div className="space-y-4">
                          {order.items.map((item) => {
                            const hasReviewed = reviews.some(
                              (review) =>
                                review.userId === user._id &&
                                review.productId === item.product
                            );
                            return (
                              <div
                                key={item.product}
                                className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center border-b pb-4 last:border-b-0"
                              >
                                <div className="flex gap-4">
                                  <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-3xl">
                                        🪴
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-black">
                                      {item.name}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                      {item.quantity} x IDR{" "}
                                      {item.price.toLocaleString("id-ID")}
                                    </p>
                                  </div>
                                </div>
                                {order.status === "selesai" && (
                                  <div>
                                    {hasReviewed ? (
                                      <p className="text-sm font-medium text-green-600">
                                        Already reviewed
                                      </p>
                                    ) : (
                                      <Link
                                        to={`/review/${item.product}`}
                                        className="flex items-center gap-2 text-sm bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition"
                                      >
                                        <MessageSquare size={16} /> Write a
                                        Review
                                      </Link>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-lg">
                            Payment Details
                          </h4>
                          <div className="text-sm p-4 bg-gray-50 rounded-md space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium text-black">
                                IDR {order.subtotal.toLocaleString("id-ID")}
                              </span>
                            </div>
                            {order.diskon > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount ({order.kodeVoucher}):</span>
                                <span className="font-medium">
                                  - IDR {order.diskon.toLocaleString("id-ID")}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Courier Fee:
                              </span>
                              <span className="font-medium text-black">
                                IDR {order.kurir.biaya.toLocaleString("id-ID")}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2 mt-2">
                              <span>Total Paid:</span>
                              <span>
                                IDR {order.totalHarga.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-lg">
                            Shipping Address
                          </h4>
                          <div className="text-sm p-4 bg-gray-50 rounded-md">
                            <p className="font-bold text-black">{order.nama}</p>
                            <p className="text-gray-600">
                              {formatPhoneNumber(order.noTelpPenerima)}
                            </p>
                            <p className="text-gray-600 mt-1 whitespace-pre-line">
                              {order.alamat}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border rounded-sm">
              <h2 className="text-2xl font-semibold text-black">
                No Order History
              </h2>
              <p className="text-gray-500 mt-2">
                You haven't placed any orders yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pesanan;