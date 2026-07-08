"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@apollo/client/react/hooks';
import { GET_CUSTOMER_ORDERS_QUERY } from '@/graphql/queries';
import { sanitizeHtml } from '@/utils/sanitize';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import {
  ShoppingBag,
  ClipboardCheck,
  Clock,
  ArrowLeft,
  Package,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type OrderStatus =
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "ON_HOLD"
  | "PROCESSING"
  | "PENDING"
  | "REFUNDED";

interface Order {
  id: string;
  databaseId: number;
  date: string;
  total: string;
  status: OrderStatus;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const ACTIVE_STATUSES: OrderStatus[] = ["PROCESSING", "ON_HOLD", "PENDING"];

const translateStatus = (status: OrderStatus): string => {
  const map: Record<OrderStatus, string> = {
    COMPLETED: "تکمیل شده",
    PROCESSING: "در حال پردازش",
    ON_HOLD: "در انتظار بررسی",
    PENDING: "در انتظار پرداخت",
    CANCELLED: "لغو شده",
    REFUNDED: "مسترد شده",
    FAILED: "ناموفق",
  };
  return map[status] || status;
};

const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/20 text-green-300";
    case "PROCESSING":
      return "bg-blue-500/20 text-blue-300";
    case "ON_HOLD":
      return "bg-yellow-500/20 text-yellow-300";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-300";
    case "CANCELLED":
      return "bg-red-500/20 text-red-300";
    case "REFUNDED":
      return "bg-gray-500/20 text-gray-400";
    case "FAILED":
      return "bg-red-700/30 text-red-400";
    default:
      return "bg-gray-600/20 text-gray-300";
  }
};

/* ------------------------------------------------------------------ */
/*  Dashboard Component                                                */
/* ------------------------------------------------------------------ */
export default function AccountContent() {
  const { user } = useAuth();
  const avatarLetter =
    user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?";

  const { loading, error, data } = useQuery(GET_CUSTOMER_ORDERS_QUERY, {
    skip: false,
  });

  const orders: Order[] = data?.customer?.orders?.nodes || [];
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  ).length;
  const completedOrders = orders.filter(
    (o) => o.status === "COMPLETED"
  ).length;

  // Last 3 orders for the "recent orders" section
  const recentOrders = orders.slice(0, 3);

  return (
    <section className="space-y-8">
      {/* ===== Welcome Banner ===== */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-l from-sky-600/20 via-slate-800 to-slate-800 border border-sky-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky-500/25 border-2 border-sky-400 flex items-center justify-center text-sky-300 text-3xl sm:text-4xl font-bold select-none shrink-0">
            {avatarLetter}
          </div>
          <div className="text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">
              خوش آمدید،{" "}
              <span className="text-sky-400">
                {user?.displayName || "کاربر عزیز"}
              </span>
            </h1>
            <p className="mt-1 text-gray-400 text-sm sm:text-base">
              از داشبورد کاربری خود مدیریت کنید و آخرین سفارش‌هایتان را پیگیری
              کنید.
            </p>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ===== Quick Stats Row ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Orders */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-sky-500/15 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">تعداد سفارش‌ها</p>
            <p className="text-2xl font-bold text-gray-100">
              {loading ? (
                <span className="inline-block w-8 h-7 bg-slate-700 animate-pulse rounded" />
              ) : (
                totalOrders
              )}
            </p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/15 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">سفارش‌های فعال</p>
            <p className="text-2xl font-bold text-gray-100">
              {loading ? (
                <span className="inline-block w-8 h-7 bg-slate-700 animate-pulse rounded" />
              ) : (
                activeOrders
              )}
            </p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">سفارش‌های تکمیل‌شده</p>
            <p className="text-2xl font-bold text-gray-100">
              {loading ? (
                <span className="inline-block w-8 h-7 bg-slate-700 animate-pulse rounded" />
              ) : (
                completedOrders
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Recent Orders ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-100">
            آخرین سفارش‌ها
          </h2>
          {orders.length > 3 && (
            <Link
              href="/account/orders"
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
            >
              مشاهده همه
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Link>
          )}
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <ErrorDisplay
            message={`خطا در دریافت سفارش‌ها: ${error.message}`}
          />
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
            <Link
              href="/products"
              className="mt-4 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
              شروع خرید
            </Link>
          </div>
        )}

        {!loading && !error && recentOrders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/60 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-sky-300">
                    #{order.databaseId}
                  </span>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {translateStatus(order.status)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">تاریخ</span>
                    <span className="text-gray-300" dir="ltr">
                      {new Date(order.date).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">مبلغ کل</span>
                    <span
                      className="text-gray-200 font-medium"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(order.total || ""),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-md transition-colors duration-300 text-sm sm:text-base"
        >
          <ShoppingBag className="w-5 h-5" />
          شروع خرید
        </Link>
        <Link
          href="/account/orders"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-700/70 hover:bg-slate-700 text-gray-200 font-semibold rounded-xl border border-slate-600/50 transition-colors duration-300 text-sm sm:text-base"
        >
          <Package className="w-5 h-5" />
          مشاهده همه سفارش‌ها
        </Link>
      </div>
    </section>
  );
}
