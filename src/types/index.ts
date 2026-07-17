// --- Application Types ---

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  galleryImages?: { id: string; url: string }[];
  specifications?: { name: string; value: string }[];
  category: string;
  price: number;
  slug: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
}

export interface ProductNode {
  __typename: 'SimpleProduct' | 'VariableProduct';
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  displayPrice?: string;
  price?: string;
  sku?: string;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
  galleryImages?: {
    nodes: {
      sourceUrl: string;
      altText?: string;
    }[];
  };
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_HOLD' | null;
  productCategories?: {
    nodes: ProductCategory[];
  };
  /** WooCommerce product meta — used by Noskhan (MNSWMC) plugin for USD pricing. */
  metaData?: {
    key: string;
    value: string | null;
  }[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
}

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
  priceHash?: string;
}

// --- WooCommerce REST API Types ---

export interface WCOrderLineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id?: number;
    quantity: number;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    sku?: string;
    price?: number;
    meta_data?: WCOrderMetaData[];
}

export interface WCOrderMetaData {
    id: number;
    key: string;
    value: string;
}

export interface WCBilling {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    company?: string;
}

export interface WCShipping {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
}

export interface WCLineItem {
    product_id: number;
    quantity: number;
}

export interface WCMetaData {
    key: string;
    value: string;
}

export interface WCShippingLine {
    method_id: string;
    method_title: string;
    total: string;
}

export interface WCCreateOrderInput {
    payment_method?: string;
    payment_method_title?: string;
    status?: string;
    customer_id?: number;
    billing?: WCBilling;
    shipping?: WCShipping;
    line_items?: WCLineItem[];
    shipping_lines?: WCShippingLine[];
    customer_note?: string;
    meta_data?: WCMetaData[];
}

export interface WCOrder {
    id: number;
    number: string;
    order_key: string;
    status: string;
    total: string;
    customer_id?: number;
    billing?: WCBilling;
    shipping?: WCShipping;
    meta_data?: WCOrderMetaData[];
    line_items?: WCOrderLineItem[];
    date_created?: string;
}

export interface WCCreateCustomerInput {
    email: string;
    username?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    billing?: WCBilling;
    shipping?: WCShipping;
}

export interface WCCustomer {
    id: number;
    date_created?: string;
    email: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    billing?: WCBilling;
    shipping?: WCShipping;
}

export type WCRestResponse<T = unknown> =
    | { ok: true; status: number; data: T }
    | { ok: false; status: number; data: { message?: string } };
