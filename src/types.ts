export type ReceiptCategory = 'Physical Books' | 'Digital Licenses' | 'Mixed' | 'Unknown';

export interface ReceiptItem {
  description: string;
  amount: number;
  quantity: number;
}

export interface ReceiptAnalysis {
  id: string;
  timestamp: number;
  category: ReceiptCategory;
  items: ReceiptItem[];
  totalAmount: number;
  currency: string;
  vendorName: string;
  confidence: number;
  summary: string;
  imageUrl?: string;
}
