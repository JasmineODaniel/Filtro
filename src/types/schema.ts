import { Schema } from './query'

export const USERS_SCHEMA: Schema = {
  id: 'users',
  name: 'Users',
  fields: [
    { name: 'id', label: 'ID', type: 'string' },
    { name: 'name', label: 'Name', type: 'string' },
    { name: 'email', label: 'Email', type: 'string' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'country', label: 'Country', type: 'string' },
    { name: 'status', label: 'Status', type: 'enum', enumValues: ['active', 'inactive', 'banned'] },
    { name: 'createdAt', label: 'Created At', type: 'date' },
    { name: 'purchases', label: 'Purchases', type: 'number' },
    { name: 'verified', label: 'Verified', type: 'boolean' },
  ],
}

export const ORDERS_SCHEMA: Schema = {
  id: 'orders',
  name: 'Orders',
  fields: [
    { name: 'id', label: 'Order ID', type: 'string' },
    { name: 'customerId', label: 'Customer ID', type: 'string' },
    { name: 'total', label: 'Total', type: 'number' },
    { name: 'status', label: 'Status', type: 'enum', enumValues: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
    { name: 'createdAt', label: 'Created At', type: 'date' },
    { name: 'quantity', label: 'Quantity', type: 'number' },
    { name: 'region', label: 'Region', type: 'string' },
    { name: 'priority', label: 'Priority', type: 'boolean' },
  ],
}

export const PRODUCTS_SCHEMA: Schema = {
  id: 'products',
  name: 'Products',
  fields: [
    { name: 'id', label: 'Product ID', type: 'string' },
    { name: 'name', label: 'Name', type: 'string' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'category', label: 'Category', type: 'enum', enumValues: ['electronics', 'clothing', 'food', 'books', 'other'] },
    { name: 'inStock', label: 'In Stock', type: 'boolean' },
    { name: 'rating', label: 'Rating', type: 'number' },
    { name: 'createdAt', label: 'Created At', type: 'date' },
  ],
}

export const ALL_SCHEMAS: Schema[] = [USERS_SCHEMA, ORDERS_SCHEMA, PRODUCTS_SCHEMA]