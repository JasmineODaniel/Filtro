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
  { id: '1',  name: 'Amara Okafor',      email: 'amara@email.com',      age: 28, country: 'Nigeria',      status: 'active',   createdAt: '2024-01-15', purchases: 12, verified: true  },
  { id: '2',  name: 'James Carter',      email: 'james@email.com',      age: 34, country: 'USA',          status: 'active',   createdAt: '2024-02-20', purchases: 5,  verified: true  },
  { id: '3',  name: 'Sofia Mendes',      email: 'sofia@email.com',      age: 22, country: 'Brazil',       status: 'inactive', createdAt: '2024-03-10', purchases: 0,  verified: false },
  { id: '4',  name: 'Liam Chen',         email: 'liam@email.com',       age: 45, country: 'China',        status: 'active',   createdAt: '2023-11-05', purchases: 30, verified: true  },
  { id: '5',  name: 'Fatima Al-Hassan',  email: 'fatima@email.com',     age: 19, country: 'Nigeria',      status: 'banned',   createdAt: '2024-04-01', purchases: 2,  verified: false },
  { id: '6',  name: 'Noah Williams',     email: 'noah@email.com',       age: 31, country: 'UK',           status: 'active',   createdAt: '2023-09-18', purchases: 18, verified: true  },
  { id: '7',  name: 'Yuki Tanaka',       email: 'yuki@email.com',       age: 27, country: 'Japan',        status: 'active',   createdAt: '2024-05-22', purchases: 8,  verified: true  },
  { id: '8',  name: 'Elena Popescu',     email: 'elena@email.com',      age: 16, country: 'Romania',      status: 'inactive', createdAt: '2024-06-30', purchases: 0,  verified: false },
  { id: '9',  name: 'Marcus Johnson',    email: 'marcus@email.com',     age: 52, country: 'USA',          status: 'active',   createdAt: '2023-07-14', purchases: 47, verified: true  },
  { id: '10', name: 'Aisha Diallo',      email: 'aisha@email.com',      age: 24, country: 'Senegal',      status: 'active',   createdAt: '2024-01-28', purchases: 6,  verified: false },
  { id: '11', name: 'Carlos Rivera',     email: 'carlos@email.com',     age: 38, country: 'Mexico',       status: 'active',   createdAt: '2023-12-01', purchases: 21, verified: true  },
  { id: '12', name: 'Priya Patel',       email: 'priya@email.com',      age: 29, country: 'India',        status: 'active',   createdAt: '2024-02-14', purchases: 14, verified: true  },
  { id: '13', name: 'David Kim',         email: 'david@email.com',      age: 41, country: 'South Korea',  status: 'inactive', createdAt: '2023-08-22', purchases: 3,  verified: false },
  { id: '14', name: 'Zara Ahmed',        email: 'zara@email.com',       age: 26, country: 'Pakistan',     status: 'active',   createdAt: '2024-03-05', purchases: 9,  verified: true  },
  { id: '15', name: 'Felix Wagner',      email: 'felix@email.com',      age: 33, country: 'Germany',      status: 'active',   createdAt: '2024-01-09', purchases: 16, verified: true  },
  { id: '16', name: 'Ingrid Larsson',    email: 'ingrid@email.com',     age: 47, country: 'Sweden',       status: 'active',   createdAt: '2023-10-30', purchases: 35, verified: true  },
  { id: '17', name: 'Kwame Asante',      email: 'kwame@email.com',      age: 23, country: 'Ghana',        status: 'inactive', createdAt: '2024-05-11', purchases: 1,  verified: false },
  { id: '18', name: 'Mei Lin',           email: 'mei@email.com',        age: 36, country: 'China',        status: 'active',   createdAt: '2024-02-28', purchases: 22, verified: true  },
  { id: '19', name: 'Bruno Costa',       email: 'bruno@email.com',      age: 20, country: 'Brazil',       status: 'active',   createdAt: '2024-04-17', purchases: 4,  verified: false },
  { id: '20', name: 'Olivia Hart',       email: 'olivia@email.com',     age: 55, country: 'UK',           status: 'active',   createdAt: '2023-06-20', purchases: 60, verified: true  },
  { id: '21', name: 'Tariq Mansoor',     email: 'tariq@email.com',      age: 30, country: 'UAE',          status: 'active',   createdAt: '2024-03-22', purchases: 11, verified: true  },
  { id: '22', name: 'Hana Suzuki',       email: 'hana@email.com',       age: 25, country: 'Japan',        status: 'banned',   createdAt: '2024-01-30', purchases: 0,  verified: false },
  { id: '23', name: 'Lucas Dupont',      email: 'lucas@email.com',      age: 43, country: 'France',       status: 'active',   createdAt: '2023-11-15', purchases: 28, verified: true  },
  { id: '24', name: 'Nadia Kowalski',    email: 'nadia@email.com',      age: 32, country: 'Poland',       status: 'active',   createdAt: '2024-02-07', purchases: 13, verified: true  },
  { id: '25', name: 'Emmanuel Adeyemi',  email: 'emmanuel@email.com',   age: 21, country: 'Nigeria',      status: 'active',   createdAt: '2024-05-01', purchases: 7,  verified: false },
  { id: '26', name: 'Sara Johansson',    email: 'sara@email.com',       age: 39, country: 'Sweden',       status: 'inactive', createdAt: '2023-09-05', purchases: 2,  verified: false },
  { id: '27', name: 'Ahmed Hassan',      email: 'ahmed@email.com',      age: 48, country: 'Egypt',        status: 'active',   createdAt: '2023-07-28', purchases: 40, verified: true  },
  { id: '28', name: 'Isabella Rossi',    email: 'isabella@email.com',   age: 27, country: 'Italy',        status: 'active',   createdAt: '2024-04-09', purchases: 10, verified: true  },
  { id: '29', name: 'Jackson Lee',       email: 'jackson@email.com',    age: 18, country: 'USA',          status: 'inactive', createdAt: '2024-06-01', purchases: 0,  verified: false },
  { id: '30', name: 'Fatou Camara',      email: 'fatou@email.com',      age: 35, country: 'Senegal',      status: 'active',   createdAt: '2024-01-18', purchases: 19, verified: true  },
  { id: '31', name: 'Ravi Sharma',       email: 'ravi@email.com',       age: 44, country: 'India',        status: 'active',   createdAt: '2023-10-12', purchases: 33, verified: true  },
  { id: '32', name: 'Chioma Eze',        email: 'chioma@email.com',     age: 26, country: 'Nigeria',      status: 'active',   createdAt: '2024-03-14', purchases: 8,  verified: true  },
  { id: '33', name: 'Mikael Berg',       email: 'mikael@email.com',     age: 37, country: 'Sweden',       status: 'banned',   createdAt: '2023-12-20', purchases: 1,  verified: false },
  { id: '34', name: 'Valentina Cruz',    email: 'valentina@email.com',  age: 29, country: 'Argentina',    status: 'active',   createdAt: '2024-02-22', purchases: 15, verified: true  },
  { id: '35', name: 'Kofi Mensah',       email: 'kofi@email.com',       age: 50, country: 'Ghana',        status: 'active',   createdAt: '2023-08-08', purchases: 52, verified: true  },
  { id: '36', name: 'Anya Ivanova',      email: 'anya@email.com',       age: 31, country: 'Russia',       status: 'inactive', createdAt: '2024-04-25', purchases: 3,  verified: false },
  { id: '37', name: 'Diego Herrera',     email: 'diego@email.com',      age: 42, country: 'Spain',        status: 'active',   createdAt: '2023-11-28', purchases: 25, verified: true  },
  { id: '38', name: 'Ling Wei',          email: 'ling@email.com',       age: 24, country: 'China',        status: 'active',   createdAt: '2024-01-05', purchases: 6,  verified: false },
  { id: '39', name: 'Amelia Thompson',   email: 'amelia@email.com',     age: 58, country: 'Australia',    status: 'active',   createdAt: '2023-05-15', purchases: 70, verified: true  },
  { id: '40', name: 'Seun Adebayo',      email: 'seun@email.com',       age: 23, country: 'Nigeria',      status: 'active',   createdAt: '2024-05-30', purchases: 5,  verified: true  },
  { id: '41', name: 'Petra Novak',       email: 'petra@email.com',      age: 46, country: 'Czech Republic', status: 'active', createdAt: '2023-09-25', purchases: 29, verified: true  },
  { id: '42', name: 'Omar Farouq',       email: 'omar@email.com',       age: 33, country: 'Egypt',        status: 'banned',   createdAt: '2024-02-10', purchases: 0,  verified: false },
  { id: '43', name: 'Natalia Sousa',     email: 'natalia@email.com',    age: 28, country: 'Brazil',       status: 'active',   createdAt: '2024-03-28', purchases: 11, verified: true  },
  { id: '44', name: 'Ethan Brooks',      email: 'ethan@email.com',      age: 22, country: 'Canada',       status: 'active',   createdAt: '2024-04-14', purchases: 4,  verified: false },
  { id: '45', name: 'Yemi Adeyinka',     email: 'yemi@email.com',       age: 40, country: 'Nigeria',      status: 'active',   createdAt: '2023-10-05', purchases: 38, verified: true  },
  { id: '46', name: 'Lin Feng',          email: 'lin@email.com',        age: 35, country: 'China',        status: 'inactive', createdAt: '2023-12-15', purchases: 7,  verified: false },
  { id: '47', name: 'Chloe Martin',      email: 'chloe@email.com',      age: 27, country: 'France',       status: 'active',   createdAt: '2024-01-22', purchases: 10, verified: true  },
  { id: '48', name: 'Abdul Rahman',      email: 'abdul@email.com',      age: 53, country: 'Saudi Arabia', status: 'active',   createdAt: '2023-06-10', purchases: 44, verified: true  },
  { id: '49', name: 'Tolu Bankole',      email: 'tolu@email.com',       age: 30, country: 'Nigeria',      status: 'active',   createdAt: '2024-02-05', purchases: 17, verified: true  },
  { id: '50', name: 'Eva Schmidt',       email: 'eva@email.com',        age: 36, country: 'Germany',      status: 'active',   createdAt: '2024-03-18', purchases: 23, verified: true  },
]

export const MOCK_ORDERS: MockOrder[] = [
  { id: 'ORD-001', customerId: '1',  total: 250.00,   status: 'delivered',   createdAt: '2024-03-01', quantity: 3,  region: 'West Africa',   priority: false },
  { id: 'ORD-002', customerId: '2',  total: 1200.00,  status: 'shipped',     createdAt: '2024-03-15', quantity: 1,  region: 'North America', priority: true  },
  { id: 'ORD-003', customerId: '3',  total: 45.00,    status: 'pending',     createdAt: '2024-04-02', quantity: 2,  region: 'South America', priority: false },
  { id: 'ORD-004', customerId: '4',  total: 3400.00,  status: 'delivered',   createdAt: '2024-02-10', quantity: 5,  region: 'East Asia',     priority: true  },
  { id: 'ORD-005', customerId: '5',  total: 89.00,    status: 'cancelled',   createdAt: '2024-04-05', quantity: 1,  region: 'West Africa',   priority: false },
  { id: 'ORD-006', customerId: '6',  total: 670.00,   status: 'processing',  createdAt: '2024-03-28', quantity: 4,  region: 'Europe',        priority: true  },
  { id: 'ORD-007', customerId: '7',  total: 120.00,   status: 'delivered',   createdAt: '2024-05-25', quantity: 2,  region: 'East Asia',     priority: false },
  { id: 'ORD-008', customerId: '9',  total: 5600.00,  status: 'delivered',   createdAt: '2024-01-20', quantity: 10, region: 'North America', priority: true  },
  { id: 'ORD-009', customerId: '11', total: 340.00,   status: 'shipped',     createdAt: '2024-04-18', quantity: 2,  region: 'North America', priority: false },
  { id: 'ORD-010', customerId: '12', total: 780.00,   status: 'delivered',   createdAt: '2024-03-08', quantity: 3,  region: 'South Asia',    priority: true  },
  { id: 'ORD-011', customerId: '13', total: 55.00,    status: 'cancelled',   createdAt: '2024-02-25', quantity: 1,  region: 'East Asia',     priority: false },
  { id: 'ORD-012', customerId: '14', total: 920.00,   status: 'delivered',   createdAt: '2024-04-30', quantity: 4,  region: 'South Asia',    priority: true  },
  { id: 'ORD-013', customerId: '15', total: 430.00,   status: 'processing',  createdAt: '2024-05-10', quantity: 2,  region: 'Europe',        priority: false },
  { id: 'ORD-014', customerId: '16', total: 2100.00,  status: 'delivered',   createdAt: '2024-01-30', quantity: 7,  region: 'Europe',        priority: true  },
  { id: 'ORD-015', customerId: '18', total: 610.00,   status: 'shipped',     createdAt: '2024-04-22', quantity: 3,  region: 'East Asia',     priority: false },
  { id: 'ORD-016', customerId: '20', total: 4800.00,  status: 'delivered',   createdAt: '2024-02-14', quantity: 8,  region: 'Europe',        priority: true  },
  { id: 'ORD-017', customerId: '23', total: 185.00,   status: 'pending',     createdAt: '2024-05-18', quantity: 1,  region: 'Europe',        priority: false },
  { id: 'ORD-018', customerId: '24', total: 990.00,   status: 'delivered',   createdAt: '2024-03-12', quantity: 5,  region: 'Europe',        priority: true  },
  { id: 'ORD-019', customerId: '27', total: 1650.00,  status: 'shipped',     createdAt: '2024-04-08', quantity: 3,  region: 'Middle East',   priority: true  },
  { id: 'ORD-020', customerId: '30', total: 275.00,   status: 'delivered',   createdAt: '2024-02-28', quantity: 2,  region: 'West Africa',   priority: false },
  { id: 'ORD-021', customerId: '31', total: 1380.00,  status: 'delivered',   createdAt: '2024-03-20', quantity: 4,  region: 'South Asia',    priority: true  },
  { id: 'ORD-022', customerId: '34', total: 390.00,   status: 'processing',  createdAt: '2024-05-05', quantity: 2,  region: 'South America', priority: false },
  { id: 'ORD-023', customerId: '35', total: 7200.00,  status: 'delivered',   createdAt: '2024-01-10', quantity: 12, region: 'West Africa',   priority: true  },
  { id: 'ORD-024', customerId: '37', total: 520.00,   status: 'shipped',     createdAt: '2024-04-28', quantity: 3,  region: 'Europe',        priority: false },
  { id: 'ORD-025', customerId: '39', total: 8900.00,  status: 'delivered',   createdAt: '2024-02-05', quantity: 15, region: 'Oceania',       priority: true  },
  { id: 'ORD-026', customerId: '41', total: 1100.00,  status: 'delivered',   createdAt: '2024-03-25', quantity: 4,  region: 'Europe',        priority: true  },
  { id: 'ORD-027', customerId: '43', total: 295.00,   status: 'pending',     createdAt: '2024-05-22', quantity: 2,  region: 'South America', priority: false },
  { id: 'ORD-028', customerId: '45', total: 2750.00,  status: 'delivered',   createdAt: '2024-01-25', quantity: 6,  region: 'West Africa',   priority: true  },
  { id: 'ORD-029', customerId: '47', total: 460.00,   status: 'shipped',     createdAt: '2024-05-14', quantity: 2,  region: 'Europe',        priority: false },
  { id: 'ORD-030', customerId: '48', total: 3100.00,  status: 'delivered',   createdAt: '2024-02-18', quantity: 5,  region: 'Middle East',   priority: true  },
]

export const MOCK_PRODUCTS: MockProduct[] = [
  { id: 'PRD-001', name: 'Wireless Headphones',      price: 199.99,  category: 'electronics', inStock: true,  rating: 4.5, createdAt: '2023-06-01' },
  { id: 'PRD-002', name: 'Cotton T-Shirt',            price: 29.99,   category: 'clothing',    inStock: true,  rating: 3.8, createdAt: '2023-08-15' },
  { id: 'PRD-003', name: 'JavaScript Bible',          price: 49.99,   category: 'books',       inStock: false, rating: 4.9, createdAt: '2023-04-20' },
  { id: 'PRD-004', name: 'Organic Rice 5kg',          price: 12.50,   category: 'food',        inStock: true,  rating: 4.2, createdAt: '2024-01-10' },
  { id: 'PRD-005', name: 'Mechanical Keyboard',       price: 349.99,  category: 'electronics', inStock: true,  rating: 4.7, createdAt: '2023-11-30' },
  { id: 'PRD-006', name: 'Running Shoes',             price: 89.99,   category: 'clothing',    inStock: false, rating: 4.1, createdAt: '2024-02-14' },
  { id: 'PRD-007', name: 'Design Patterns Book',      price: 39.99,   category: 'books',       inStock: true,  rating: 4.6, createdAt: '2023-09-05' },
  { id: 'PRD-008', name: '4K Monitor',                price: 799.99,  category: 'electronics', inStock: true,  rating: 4.8, createdAt: '2024-03-20' },
  { id: 'PRD-009', name: 'Noise Cancelling Earbuds',  price: 149.99,  category: 'electronics', inStock: true,  rating: 4.4, createdAt: '2024-01-25' },
  { id: 'PRD-010', name: 'Denim Jacket',              price: 74.99,   category: 'clothing',    inStock: true,  rating: 4.0, createdAt: '2023-10-12' },
  { id: 'PRD-011', name: 'Python Cookbook',           price: 44.99,   category: 'books',       inStock: true,  rating: 4.7, createdAt: '2023-07-18' },
  { id: 'PRD-012', name: 'Green Tea 100 bags',        price: 8.99,    category: 'food',        inStock: true,  rating: 4.3, createdAt: '2024-02-05' },
  { id: 'PRD-013', name: 'USB-C Hub 7-in-1',          price: 59.99,   category: 'electronics', inStock: true,  rating: 4.2, createdAt: '2024-03-08' },
  { id: 'PRD-014', name: 'Yoga Mat',                  price: 34.99,   category: 'other',       inStock: true,  rating: 4.5, createdAt: '2023-12-01' },
  { id: 'PRD-015', name: 'Bluetooth Speaker',         price: 129.99,  category: 'electronics', inStock: false, rating: 4.3, createdAt: '2024-01-14' },
  { id: 'PRD-016', name: 'Winter Coat',               price: 189.99,  category: 'clothing',    inStock: true,  rating: 4.6, createdAt: '2023-11-05' },
  { id: 'PRD-017', name: 'Clean Code',                price: 34.99,   category: 'books',       inStock: false, rating: 4.8, createdAt: '2023-05-30' },
  { id: 'PRD-018', name: 'Almond Butter 500g',        price: 14.99,   category: 'food',        inStock: true,  rating: 4.1, createdAt: '2024-04-01' },
  { id: 'PRD-019', name: 'Smartwatch',                price: 299.99,  category: 'electronics', inStock: true,  rating: 4.4, createdAt: '2024-02-28' },
  { id: 'PRD-020', name: 'Leather Belt',              price: 24.99,   category: 'clothing',    inStock: true,  rating: 3.9, createdAt: '2023-09-20' },
  { id: 'PRD-021', name: 'Gaming Mouse',              price: 79.99,   category: 'electronics', inStock: true,  rating: 4.6, createdAt: '2024-03-15' },
  { id: 'PRD-022', name: 'Refactoring',               price: 52.99,   category: 'books',       inStock: true,  rating: 4.7, createdAt: '2023-06-22' },
  { id: 'PRD-023', name: 'Olive Oil 1L',              price: 18.99,   category: 'food',        inStock: true,  rating: 4.5, createdAt: '2024-04-12' },
  { id: 'PRD-024', name: 'Portable Charger 20000mAh', price: 49.99,   category: 'electronics', inStock: true,  rating: 4.3, createdAt: '2024-01-30' },
  { id: 'PRD-025', name: 'Resistance Bands Set',      price: 22.99,   category: 'other',       inStock: true,  rating: 4.4, createdAt: '2024-05-01' },
]

export const MOCK_DATA: Record<string, object[]> = {
  users: MOCK_USERS,
  orders: MOCK_ORDERS,
  products: MOCK_PRODUCTS,
}
