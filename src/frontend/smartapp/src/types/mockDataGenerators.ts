import { faker } from '@faker-js/faker';
import { User, Customer, Admin, Product, Category, Cart, CartItem, Order, OrderItem } from './models';

// Helper to generate unique IDs
const genId = () => faker.string.uuid();

// Generate categories
export function generateCategories(count = 5): Category[] {
  return Array.from({ length: count }, (_, i) => ({
    id: genId(),
    name: faker.commerce.department() + ' ' + i,
    description: faker.commerce.productDescription(),
  }));
}

// Generate products
export function generateProducts(count = 20, categories: Category[]): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const categoryIds = faker.helpers.arrayElements(categories.map(c => c.id), faker.number.int({ min: 1, max: 2 }));
    return {
      id: genId(),
      name: faker.commerce.productName() + ' ' + i,
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      images: [faker.image.urlPicsumPhotos({ width: 400, height: 400 })],
      stock: faker.number.int({ min: 0, max: 100 }),
      categoryIds,
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 0, max: 200 }),
      isActive: true,
    };
  });
}

// Generate users (customers and admins)
export function generateUsers(customerCount = 5, adminCount = 1): User[] {
  const customers: Customer[] = Array.from({ length: customerCount }, () => {
    return {
      id: genId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
      address: faker.location.streetAddress(),
      orderIds: [],
      wishlistProductIds: [],
    };
  });
  const admins: Admin[] = Array.from({ length: adminCount }, () => {
    return {
      id: genId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'admin',
      permissions: ['manage_products', 'manage_orders', 'manage_users'],
    };
  });
  return [...customers, ...admins];
}

// Generate cart for a user
export function generateCart(userId: string, products: Product[]): Cart {
  const items: CartItem[] = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 })).map(product => ({
    productId: product.id,
    quantity: faker.number.int({ min: 1, max: 3 }),
  }));
  return {
    id: genId(),
    userId,
    items,
    updatedAt: faker.date.recent().toISOString(),
  };
}

// Generate order for a user
export function generateOrder(userId: string, products: Product[]): Order {
  const items: OrderItem[] = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 4 })).map(product => ({
    productId: product.id,
    quantity: faker.number.int({ min: 1, max: 2 }),
    price: product.price,
  }));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    id: genId(),
    userId,
    items,
    total,
    status: faker.helpers.arrayElement(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    shippingAddress: faker.location.streetAddress(),
  };
} 