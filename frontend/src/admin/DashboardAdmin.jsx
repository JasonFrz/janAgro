import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/user/userSlice";
import { fetchProducts } from "../features/products/productSlice";
import { fetchVouchers } from "../features/voucher/voucherSlice";

function DashboardAdmin() {
  const dispatch = useDispatch();

  const {
    users,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.users);
  const { items: produk, loading: produkLoading } = useSelector(
    (state) => state.products
  );
  const { vouchers, loading: voucherLoading } = useSelector(
    (state) => state.vouchers
  );

  const [produkSortAsc, setProdukSortAsc] = useState(true);
  const [userSortAsc, setUserSortAsc] = useState(true);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchVouchers());
  }, [dispatch]);

  const getProdukStatus = (stock) => {
    if (stock === 0)
      return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
    if (stock <= 10)
      return {
        text: "Stock Running Out",
        color: "bg-yellow-100 text-yellow-600",
      };
    return { text: "Available", color: "bg-green-100 text-green-600" };
  };

  const getUserStatus = (isBanned) => {
    if (isBanned) return { text: "Blocked", color: "bg-red-100 text-red-600" };
    return { text: "Active", color: "bg-green-100 text-green-600" };
  };

  const cards = [
    { title: "User Total", count: users?.length || 0, icon: "/icon/group.png" },
    {
      title: "Product Total",
      count: produk?.length || 0,
      icon: "/icon/product.png",
    },
    {
      title: "Voucher Total",
      count: vouchers?.length || 0,
      icon: "/icon/voucher.png",
    },
  ];

  const sortedProduk = useMemo(() => {
    return [...(produk || [])].sort((a, b) =>
      produkSortAsc ? a.stock - b.stock : b.stock - a.stock
    );
  }, [produk, produkSortAsc]);

  const sortedUsers = useMemo(() => {
    return [...(users || [])].sort((a, b) => {
      const nameA = (a.username || "").toLowerCase();
      const nameB = (b.username || "").toLowerCase();
      return userSortAsc
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [users, userSortAsc]);

  const loading = userLoading || produkLoading || voucherLoading;
  const error = userError;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-lg p-4 flex items-center space-x-4"
          >
            <img src={card.icon} alt={card.title} className="w-12 h-12" />
            <div>
              <p className="text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Section */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <span>Latest Users</span>
              <button
                onClick={() => setUserSortAsc(!userSortAsc)}
                className="p-1 rounded border hover:bg-gray-100"
                title={`Sort By Name ${userSortAsc ? "DESC" : "ASC"}`}
              >
                <img
                  src="/icon/down.png"
                  alt="Sort"
                  className={`w-4 h-4 transition-transform duration-300 ${
                    userSortAsc ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h2>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : users?.length === 0 ? (
            <p className="text-gray-500">No Users Available</p>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <ul className="divide-y divide-gray-200">
                {sortedUsers.slice(0, 6).map((user) => {
                  const status = getUserStatus(user.isBanned);
                  return (
                    <li
                      key={user._id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium text-black">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Product Section */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <span>Product Inventory</span>
              <button
                onClick={() => setProdukSortAsc(!produkSortAsc)}
                className="p-1 rounded border hover:bg-gray-100"
                title={`Sort By Stock ${produkSortAsc ? "DESC" : "ASC"}`}
              >
                <img
                  src="/icon/down.png"
                  alt="Sort"
                  className={`w-4 h-4 transition-transform duration-300 ${
                    produkSortAsc ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h2>
          </div>

          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {sortedProduk.slice(0, 6).map((p) => {
                const status = getProdukStatus(p.stock);
                return (
                  <li
                    key={p._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold">
                        Stock: {p.stock}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
