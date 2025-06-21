export type Organization = {
  organization_id: string;
  name: string;
  created_at: string;
};

export type UserType = 'Importer' | 'Supplier' | 'Admin';
export type KycStatus = 'pending' | 'verified' | 'rejected';

export type User = {
  user_id: string;
  organization_id?: string;
  email: string;
  user_type: UserType;
  business_name: string;
  vat_id: string;
  contact_info: string;
  is_active: boolean;
  kyc_status: KycStatus;
  created_at: string;
  updated_at: string;
};

export type Wallet = {
  wallet_id: string;
  user_id: string;
  currency: string;
  balance: number;
  created_at: string;
  updated_at: string;
};

export type InvoiceStatus = 'unpaid' | 'paid' | 'cancelled' | 'overdue';

export type Invoice = {
  invoice_id: string;
  importer_user_id: string;
  supplier_user_id: string;
  invoice_number: string;
  amount_due: number;
  currency: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
};

export type TransactionType = 'wallet_transfer' | 'invoice_payment' | 'admin_credit' | 'admin_debit' | 'currency_exchange';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type Transaction = {
  transaction_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  amount: number;
  currency: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  invoice_id?: string;
  timestamp: string;
};

export type Receipt = {
  receipt_id: string;
  transaction_id: string;
  invoice_id: string;
  receipt_number: string;
  generation_date: string;
  url_to_document: string;
  created_at: string;
  updated_at: string;
};
