"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client/react/hooks';
import { GET_CUSTOMER_ORDERS_QUERY } from '@/graphql/queries';
import { sanitizeHtml } from '@/utils/sanitize';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Package } from 'lucide-react';

type OrderStatus = "COMPLETED" | "CANCELLED" | "FAILED" | "ON_HOLD" | "PROCESSING" | "PENDING" | "REFUNDED";

interface Order {
  id: string;
  databaseId: number;
  date: string;
  total: string;
  status: OrderStatus;
}

const ACTIVE_STATUSES: OrderStatus[] = ["PROCESSING", "ON_HOLD", "PENDING"];

const translateStatus = (status: OrderStatus): string => {
  const translations: Record<OrderStatus, string> = {
    COMPLETED: "تکمیل شده",
    PROCESSING: "در حال پردازش",
    ON_HOLD: "در انتظار بررسی",
    PENDING: "در انتظار پرداخت",
    CANCELLED: "لغو شده",
    REFUNDED: "مسترد شده",
    FAILED: "ناموفق",
  };
  return translations[status] || status;
};

const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "COMPLETED": return "bg-green-500/20 text-green-300";
    case "PROCESSING": return "bg-blue-500/20 text-blue-300";
    case "ON_HOLD": return "bg-yellow-500/20 text-yellow-300";
    case "PENDING": return "bg-yellow-500/20 text-yellow-300";
    case "CANCELLED": return "bg-red-500/20 text-red-300";
    case "REFUNDED": return "bg-gray-500/20 text-gray-400";
    case "FAILED": return "bg-red-700/30 text-red-400";
    default: return "bg-gray-600/20 text-gray-300";
  }
};

export default function OrdersContent() {
  const { loading, error, data } = useQuery(GET_CUSTOMER_ORDERS_QUERY);
  const orders: Order[] = data?.customer?.orders?.nodes || [];

  // Quick stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">سفارش‌های من</h1>
        {!loading && orders.length > 0 && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              مجموع: <span className="text-gray-200 font-semibold nums">{totalOrders}</span>
            </span>
            {activeOrders > 0 && (
              <span className="flex items-center gap-1 text-yellow-400">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="nums">{activeOrders}</span> فعال
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Error */}
      {error && <ErrorDisplay message={`خطا در دریافت سفارش‌ها: ${error.message}`} />}

      {/* Empty state */}
      {!loading && !error && orders.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-lg">هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
          >
            شروع خرید
          </Link>
        </div>
      )}

      {/* Orders table */}
      {!loading && !error && orders.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-x-auto">
          <table className="w-full min-w-[600px] text-right">
            <thead className="border-b border-slate-700/60">
              <tr>
                <th className="py-4 px-4 sm:px-6 text-sm font-semibold text-sky-300">شماره سفارش</th>
                <th className="py-4 px-4 sm:px-6 text-sm font-semibold text-sky-300">تاریخ</th>
                <th className="py-4 px-4 sm:px-6 text-sm font-semibold text-sky-300">مبلغ کل</th>
                <th className="py-4 px-4 sm:px-6 text-sm font-semibold text-sky-300">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors duration-150">
                  <td className="py-4 px-4 sm:px-6 text-gray-200 font-medium nums">
                    #{order.databaseId}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-gray-300 nums" dir="ltr">
                    {new Date(order.date).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-gray-300 nums" dangerouslySetInnerHTML={{ __html: sanitizeHtml(order.total || '') }} />
                  <td className="py-4 px-4 sm:px-6">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
