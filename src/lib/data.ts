import type { User, Wallet, Invoice, Transaction, Organization } from './types';

export const organizations: Organization[] = [
  { organization_id: 'org1', name: 'Global Imports Inc.', created_at: new Date().toISOString() },
  { organization_id: 'org2', name: 'Stark Industries', created_at: new Date().toISOString() },
];

export const users: User[] = [
  {
    user_id: 'admin1',
    email: 'admin@transacteasy.com',
    user_type: 'Admin',
    business_name: 'TransactEasy Corp',
    vat_id: 'TE123456789',
    contact_info: '123 Admin St, Biz City',
    is_active: true,
    kyc_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 'importer1',
    organization_id: 'org1',
    email: 'importer@globalimports.com',
    user_type: 'Importer',
    business_name: 'Global Imports Inc.',
    vat_id: 'GI123456789',
    contact_info: '456 Import Ave, Trade Town',
    is_active: true,
    kyc_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 'supplier1',
    organization_id: 'org2',
    email: 'supplier@stark.io',
    user_type: 'Supplier',
    business_name: 'Stark Industries',
    vat_id: 'SI987654321',
    contact_info: '789 Supply Rd, Tech Valley',
    is_active: true,
    kyc_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const wallets: Wallet[] = [
  { wallet_id: 'w1', user_id: 'importer1', currency: 'USD', balance: 50000.00, created_at: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { wallet_id: 'w2', user_id: 'importer1', currency: 'EUR', balance: 25000.00, created_at: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { wallet_id: 'w3', user_id: 'supplier1', currency: 'USD', balance: 120000.00, created_at: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { wallet_id: 'w4', user_id: 'admin1', currency: 'USD', balance: 1000000.00, created_at: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const invoices: Invoice[] = [
  {
    invoice_id: 'inv1',
    importer_user_id: 'importer1',
    supplier_user_id: 'supplier1',
    invoice_number: 'SI-2024-001',
    amount_due: 15000.00,
    currency: 'USD',
    issue_date: '2024-07-01',
    due_date: '2024-07-31',
    status: 'unpaid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    invoice_id: 'inv2',
    importer_user_id: 'importer1',
    supplier_user_id: 'supplier1',
    invoice_number: 'SI-2024-002',
    amount_due: 2500.00,
    currency: 'USD',
    issue_date: '2024-06-15',
    due_date: '2024-07-15',
    status: 'paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
    {
    invoice_id: 'inv3',
    importer_user_id: 'importer1',
    supplier_user_id: 'supplier1',
    invoice_number: 'SI-2024-003',
    amount_due: 5000.00,
    currency: 'EUR',
    issue_date: '2024-07-10',
    due_date: '2024-08-10',
    status: 'unpaid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const transactions: Transaction[] = [
  {
    transaction_id: 'txn1',
    sender_user_id: 'importer1',
    receiver_user_id: 'supplier1',
    amount: 2500.00,
    currency: 'USD',
    transaction_type: 'invoice_payment',
    status: 'completed',
    invoice_id: 'inv2',
    timestamp: '2024-07-10T10:00:00Z',
  },
  {
    transaction_id: 'txn2',
    sender_user_id: 'admin1',
    receiver_user_id: 'importer1',
    amount: 10000.00,
    currency: 'USD',
    transaction_type: 'admin_credit',
    status: 'completed',
    timestamp: '2024-06-20T09:00:00Z',
  },
];
