export interface MockUser {
  id: string
  name: string
  email: string
  age: number
  country: string
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
  purchases: number
  verified: boolean
}

export interface MockOrder {
  id: string
  customerId: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  quantity: number
  region: string
  priority: boolean
}

export interface MockProduct {
  id: string
  name: string
  price: number
  category: 'electronics' | 'clothing' | 'food' | 'books' | 'other'
  inStock: boolean
  rating: number
  createdAt: string
}

export const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Amara Okafor', email: 'amara@email.com', age: 28, country: 'Nigeria', status: 'active', createdAt: '2024-01-15', purchases: 12, verified: true },
  { id: '2', name: 'James Carter', email: 'james@email.com', age: 34, country: 'USA', status: 'active', createdAt: '2024-02-20', purchases: 5, verified: true },
  { id: '3', name: 'Sofia Mendes', email: 'sofia@email.com', age: 22, country: 'Brazil', status: 'inactive', createdAt: '2024-03-10', purchases: 0, verified: false },
  { id: '4', name: 'Liam Chen', email: 'liam@email.com', age: 45, country: 'China', status: 'active', createdAt: '2023-11-05', purchases: 30, verified: true },
  { id: '5', name: 'Fatima Al-Hassan', email: 'fatima@email.com', age: 19, country: 'Nigeria', status: 'banned', createdAt: '2024-04-01', purchases: 2, verified: false },
  { id: '6', name: 'Noah Williams', email: 'noah@email.com', age: 31, country: 'UK', status: 'active', createdAt: '2023-09-18', purchases: 18, verified: true },
  { id: '7', name: 'Yuki Tanaka', email: 'yuki@email.com', age: 27, country: 'Japan', status: 'active', createdAt: '2024-05-22', purchases: 8, verified: true },
  { id: '8', name: 'Elena Popescu', email: 'elena@email.com', age: 16, country: 'Romania', status: 'inactive', createdAt: '2024-06-30', purchases: 0, verified: false },
  { id: '9', name: 'Marcus Johnson', email: 'marcus@email.com', age: 52, country: 'USA', status: 'active', createdAt: '2023-07-14', purchases: 47, verified: true },
  { id: '10', name: 'Aisha Diallo', email: 'aisha@email.com', age: 24, country: 'Senegal', status: 'active', createdAt: '2024-01-28', purchases: 6, verified: false },
]

export const MOCK_ORDERS: MockOrder[] = [
  { id: 'ORD-001', customerId: '1', total: 250.00, status: 'delivered', createdAt: '2024-03-01', quantity: 3, region: 'West Africa', priority: false },
  { id: 'ORD-002', customerId: '2', total: 1200.00, status: 'shipped', createdAt: '2024-03-15', quantity: 1, region: 'North America', priority: true },
  { id: 'ORD-003', customerId: '3', total: 45.00, status: 'pending', createdAt: '2024-04-02', quantity: 2, region: 'South America', priority: false },
  { id: 'ORD-004', customerId: '4', total: 3400.00, status: 'delivered', createdAt: '2024-02-10', quantity: 5, region: 'East Asia', priority: true },
  { id: 'ORD-005', customerId: '5', total: 89.00, status: 'cancelled', createdAt: '2024-04-05', quantity: 1, region: 'West Africa', priority: false },
  { id: 'ORD-006', customerId: '6', total: 670.00, status: 'processing', createdAt: '2024-03-28', quantity: 4, region: 'Europe', priority: true },
  { id: 'ORD-007', customerId: '7', total: 120.00, status: 'delivered', createdAt: '2024-05-25', quantity: 2, region: 'East Asia', priority: false },
  { id: 'ORD-008', customerId: '9', total: 5600.00, status: 'delivered', createdAt: '2024-01-20', quantity: 10, region: 'North America', priority: true },
]

export const MOCK_PRODUCTS: MockProduct[] = [
  { id: 'PRD-001', name: 'Wireless Headphones', price: 199.99, category: 'electronics', inStock: true, rating: 4.5, createdAt: '2023-06-01' },
  { id: 'PRD-002', name: 'Cotton T-Shirt', price: 29.99, category: 'clothing', inStock: true, rating: 3.8, createdAt: '2023-08-15' },
  { id: 'PRD-003', name: 'JavaScript Bible', price: 49.99, category: 'books', inStock: false, rating: 4.9, createdAt: '2023-04-20' },
  { id: 'PRD-004', name: 'Organic Rice 5kg', price: 12.50, category: 'food', inStock: true, rating: 4.2, createdAt: '2024-01-10' },
  { id: 'PRD-005', name: 'Mechanical Keyboard', price: 349.99, category: 'electronics', inStock: true, rating: 4.7, createdAt: '2023-11-30' },
  { id: 'PRD-006', name: 'Running Shoes', price: 89.99, category: 'clothing', inStock: false, rating: 4.1, createdAt: '2024-02-14' },
  { id: 'PRD-007', name: 'Design Patterns Book', price: 39.99, category: 'books', inStock: true, rating: 4.6, createdAt: '2023-09-05' },
  { id: 'PRD-008', name: '4K Monitor', price: 799.99, category: 'electronics', inStock: true, rating: 4.8, createdAt: '2024-03-20' },
]

export const MOCK_DATA: Record<string, object[]> = {
  users: MOCK_USERS,
  orders: MOCK_ORDERS,
  products: MOCK_PRODUCTS,
}