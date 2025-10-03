import type { Change } from '@/lib/types';

export const mockChanges: Change[] = [
  {
    id: 'chg_1',
    type: 'UPDATE',
    entity: 'User',
    entityName: 'Alice Johnson',
    timestamp: '2024-07-29T10:00:00Z',
    details: {
      old: { email: 'alice.j@example.com', role: 'editor' },
      new: { email: 'alice.johnson@example.com', role: 'editor' },
    },
    status: 'pending',
  },
  {
    id: 'chg_2',
    type: 'CREATE',
    entity: 'Product',
    entityName: 'SyncWidget Pro',
    timestamp: '2024-07-29T10:05:00Z',
    details: {
      new: { name: 'SyncWidget Pro', price: 99.99, stock: 100 },
    },
    status: 'pending',
  },
  {
    id: 'chg_3',
    type: 'DELETE',
    entity: 'Order',
    entityName: '#ORD-00123',
    timestamp: '2024-07-29T10:10:00Z',
    details: {
      old: { id: 'ORD-00123', customer: 'Bob Williams', total: 49.99 },
    },
    status: 'pending',
  },
  {
    id: 'chg_4',
    type: 'UPDATE',
    entity: 'Settings',
    entityName: 'API Configuration',
    timestamp: '2024-07-29T10:15:00Z',
    details: {
      old: { timeout: 30000, retries: 3 },
      new: { timeout: 60000, retries: 5 },
    },
    status: 'approved',
  },
  {
    id: 'chg_5',
    type: 'CREATE',
    entity: 'User',
    entityName: 'Charlie Brown',
    timestamp: '2024-07-29T10:20:00Z',
    details: {
      new: { name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'viewer' },
    },
    status: 'rejected',
  },
];
