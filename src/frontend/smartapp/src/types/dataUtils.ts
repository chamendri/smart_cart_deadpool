import { readFile } from 'fs/promises';
import { Product, Category, User, Order } from './models';

const DATA_DIR = 'smartapp/data';

// Loaders
export async function loadProducts(): Promise<Product[]> {
  const data = await readFile(`${DATA_DIR}/products.json`, 'utf-8');
  return JSON.parse(data) as Product[];
}

export async function loadCategories(): Promise<Category[]> {
  const data = await readFile(`${DATA_DIR}/categories.json`, 'utf-8');
  return JSON.parse(data) as Category[];
}

export async function loadUsers(): Promise<User[]> {
  const data = await readFile(`${DATA_DIR}/users.json`, 'utf-8');
  return JSON.parse(data) as User[];
}

export async function loadOrders(): Promise<Order[]> {
  const data = await readFile(`${DATA_DIR}/orders.json`, 'utf-8');
  return JSON.parse(data) as Order[];
}

// Queries
export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await loadProducts();
  return products.find(p => p.id === id);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter(p => p.categoryIds.includes(categoryId));
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find(u => u.id === id);
}

// Add more as needed (e.g., getOrdersByUserId, filter/sort/paginate, etc.) 