/**
 * Shipping methods configuration for the VIRA e-commerce storefront.
 *
 * Shipping costs are NOT added to the order total. Customers must
 * contact support to coordinate courier arrangements and pricing.
 *
 * Extensibility (Rule #9): Adding a new shipping method only requires
 * appending an entry to the SHIPPING_METHODS array. The checkout page
 * and API routes all consume this single source of truth.
 */

export interface ShippingMethod {
  /** Unique method ID — sent to WooCommerce as method_id */
  id: string;
  /** Persian display name */
  title: string;
  /** Short description in Persian */
  description: string;
  /** Estimated delivery time in Persian */
  estimatedDays: string;
  /** lucide-react icon name for UI rendering */
  icon: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'snapp_express',
    title: 'اسنپ اکسپرس',
    description: 'ارسال سریع با اسنپ‌اکسپرس',
    estimatedDays: '۱ تا ۳ روز کاری',
    icon: 'Truck',
  },
  {
    id: 'tipax',
    title: 'تیباکس',
    description: 'ارسال با تیباکس (پیک موتوری)',
    estimatedDays: '۱ تا ۲ روز کاری',
    icon: 'Bike',
  },
  {
    id: 'post_pishtaz',
    title: 'پست پیشتاز',
    description: 'ارسال از طریق پست پیشتاز ایران',
    estimatedDays: '۳ تا ۵ روز کاری',
    icon: 'Package',
  },
];
