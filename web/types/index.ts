// 1. User Profile Document
export interface UserProfile {
  uid: string;
  email: string;
  businessName: string;
  currency: 'USD' | 'GHS' | 'EUR' | 'GBP';
  createdAt: string; // ISO String or Firestore Timestamp
}

// 2. Product Document
export interface Product {
  id: string;
  userId: string;
  name: string;
  sku?: string;
  category: string;
  costPrice: number;    // Buying/production price
  sellingPrice: number; // Selling price
  stockQuantity: number;
  lowStockThreshold: number; // e.g. alert when stock <= 5
  createdAt: string;
  updatedAt: string;
}

// 3. Single Item inside a Sale
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  totalPrice: number;
}

// 4. Sale Transaction Document
export interface Sale {
  id: string;
  userId: string;
  items: SaleItem[];
  totalAmount: number;
  totalProfit: number;
  paymentMethod: 'cash' | 'card' | 'mobile_money';
  createdAt: string;
}

// 5. Automated Insight Document
export interface DailyInsight {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  totalRevenue: number;
  totalProfit: number;
  totalSalesCount: number;
  topSellingProductId?: string;
  lowStockAlertCount: number;
}